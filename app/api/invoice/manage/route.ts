import { NextResponse } from 'next/server';
import { connectMongo } from '@/utils/mongodb';
import mongoose from 'mongoose';
// Import models in dependency order to ensure proper registration
import Enrolled from '@/models/enrolled';
import Invoice from '@/models/Invoice';
import ManualInvoice from '@/models/ManualInvoice';
import { deleteMultipleFromS3, collectInvoiceImageUrls } from '@/utils/s3Utils';

// Update invoice (approve, payment, etc.)
export async function PATCH(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    const { invoiceId, action, amount, certificateData, paymentMode, paidDate, installmentNumber, installmentPaymentAmount, nextDueDate } = body;

    console.log('PATCH request received:', { invoiceId, action, amount, paymentMode, paidDate, installmentNumber, installmentPaymentAmount, nextDueDate });

    if (!invoiceId || !action) {
      return NextResponse.json(
        { error: 'Invoice ID and action are required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID format' },
        { status: 400 }
      );
    }

    // Try to find invoice in both collections
    let invoice = null;
    let isManualInvoice = false;
    
    try {
      invoice = await Invoice.findById(invoiceId);
      console.log('Regular invoice found:', !!invoice);
    } catch (error: any) {
      console.log('Error finding regular invoice:', error.message);
    }
    
    if (!invoice) {
      try {
        invoice = await ManualInvoice.findById(invoiceId);
        isManualInvoice = true;
        console.log('Manual invoice found:', !!invoice);
      } catch (error: any) {
        console.log('Error finding manual invoice:', error.message);
      }
    }

    if (!invoice) {
      console.log('Invoice not found in either collection for ID:', invoiceId);
      return NextResponse.json(
        { error: 'Invoice not found in system' },
        { status: 404 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'approve':
        updateData = { 
          isApproved: true, 
          approvedDate: new Date() 
        };
        break;

      case 'unapprove':
        updateData = { 
          isApproved: false, 
          approvedDate: null 
        };
        break;

      case 'approve_certificate':
        updateData = { 
          certificateApproved: true, 
          certificateApprovedDate: new Date() 
        };
        
        // Also update enrollment with certificate data (only for regular invoices)
        if (certificateData && !isManualInvoice && invoice.enrollmentId) {
          try {
            await Enrolled.findByIdAndUpdate(
              invoice.enrollmentId,
              {
                certificate: {
                  enrolledDate: certificateData.enrolledDate || new Date(),
                  completionDate: certificateData.completionDate || new Date(),
                  certificateId: certificateData.certificateId || `CERT-${Date.now()}`
                },
                courseCompletion: true
              }
            );
          } catch (enrollmentError: any) {
            console.log('Failed to update enrollment certificate:', enrollmentError.message);
          }
        }
        break;

      case 'update_payment':
        if (typeof amount !== 'number' || amount < 0) {
          return NextResponse.json(
            { error: 'Valid payment amount is required (must be >= 0)' },
            { status: 400 }
          );
        }
        
        if (amount > invoice.totalAmount) {
          return NextResponse.json(
            { error: 'Payment amount cannot exceed total amount' },
            { status: 400 }
          );
        }
        
        updateData = { 
          paidAmount: amount,
          pendingAmount: invoice.totalAmount - amount
        };
        
        // Update payment mode if provided
        if (paymentMode) {
          updateData.paymentMode = paymentMode;
        }
        
        // Update paid date if provided or set current date for new payments
        if (paidDate) {
          updateData.paidDate = new Date(paidDate);
        } else if (amount > invoice.paidAmount) {
          // Only update paid date if payment amount increased
          updateData.paidDate = new Date();
        }
        
        // Handle payment screenshot upload
        if (body.paymentScreenshotUrl) {
          // Initialize paymentScreenshots array if it doesn't exist
          if (!invoice.paymentScreenshots) {
            invoice.paymentScreenshots = [];
          }
          
          // Calculate payment number based on existing screenshots
          const paymentNumber = invoice.paymentScreenshots.length + 1;
          
          // Add new payment screenshot
          invoice.paymentScreenshots.push({
            url: body.paymentScreenshotUrl,
            uploadDate: new Date(),
            paymentNumber: paymentNumber
          });
          
          updateData.paymentScreenshots = invoice.paymentScreenshots;
        }
        
        // Handle installment payment tracking
        if (installmentNumber && installmentPaymentAmount) {
          // Initialize installmentPayments array if it doesn't exist
          if (!invoice.installmentPayments) {
            invoice.installmentPayments = [];
          }
          
          // Add or update installment payment record
          const existingPaymentIndex = invoice.installmentPayments.findIndex(
            (payment: any) => payment.installmentNumber === installmentNumber
          );
          
          const installmentPayment = {
            installmentNumber,
            paidDate: paidDate ? new Date(paidDate) : new Date(),
            amount: installmentPaymentAmount,
            paymentMode: paymentMode || 'online'
          };
          
          if (existingPaymentIndex >= 0) {
            invoice.installmentPayments[existingPaymentIndex] = installmentPayment;
          } else {
            invoice.installmentPayments.push(installmentPayment);
          }
          
          updateData.installmentPayments = invoice.installmentPayments;
        }
        
        // Update status based on payment
        if (amount >= invoice.totalAmount) {
          updateData.status = 'paid';
          updateData.dueDate = null; // Clear due date when fully paid
        } else if (amount > 0) {
          updateData.status = 'partial';
          // Update due date if provided, or keep existing due date
          if (nextDueDate) {
            updateData.dueDate = new Date(nextDueDate);
          } else if (!invoice.dueDate) {
            // If no due date exists and none provided, set default 30 days from now
            const defaultDueDate = new Date();
            defaultDueDate.setDate(defaultDueDate.getDate() + 30);
            updateData.dueDate = defaultDueDate;
          }
          // If invoice already has a due date and no new one provided, keep the existing one
        } else {
          updateData.status = 'due';
          // Ensure due date exists for unpaid invoices
          if (!invoice.dueDate && !nextDueDate) {
            const defaultDueDate = new Date();
            defaultDueDate.setDate(defaultDueDate.getDate() + 30);
            updateData.dueDate = defaultDueDate;
          } else if (nextDueDate) {
            updateData.dueDate = new Date(nextDueDate);
          }
        }
        
        console.log('Payment update data:', updateData);
        break;

      case 'update_invoice': {
        // Extract invoice data from request body
        const { customerDetails, courseDetails, items, tax, paymentMode: updatePaymentMode, feeType, paidAmount, installmentDates, dueDate, paidDate: updatePaidDate, paymentScreenshot, salesPerson } = body;
        
        if (!customerDetails || !courseDetails) {
          return NextResponse.json(
            { error: 'Customer and course details are required' },
            { status: 400 }
          );
        }

        // Calculate amounts
        const subtotal = items ? items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0) : courseDetails.price;
        const totalAmount = subtotal + (tax || 0);
        
        updateData = {
          customerDetails: {
            name: customerDetails.name,
            email: customerDetails.email,
            phone: customerDetails.phone,
            studentId: customerDetails.studentId
          },
          courseDetails: {
            title: courseDetails.title,
            link: courseDetails.link || 'https://techpratham.com',
            category: courseDetails.category || 'General',
            duration: courseDetails.duration || 'N/A',
            level: courseDetails.level || 'Beginner'
          },
          items: items || [{
            description: 'Course Fee',
            quantity: 1,
            unitPrice: courseDetails.price,
            amount: courseDetails.price
          }],
          subtotal,
          tax: tax || 0,
          totalAmount,
          paidAmount: paidAmount || 0,
          pendingAmount: totalAmount - (paidAmount || 0),
          feeType: feeType || 'Full Payment',
          installmentDates: installmentDates || [],
          paymentMode: updatePaymentMode || 'online',
          dueDate: dueDate ? new Date(dueDate) : null,
          paidDate: updatePaidDate ? new Date(updatePaidDate) : ((paidAmount || 0) > 0 ? new Date() : null),
          paymentScreenshot: paymentScreenshot || null,
          salesPerson: salesPerson || null
        };

        // Update status based on payment
        if ((paidAmount || 0) >= totalAmount) {
          updateData.status = 'paid';
          updateData.dueDate = null; // Clear due date when fully paid
        } else if ((paidAmount || 0) > 0) {
          updateData.status = 'partial';
        } else {
          updateData.status = 'due';
        }
        
        console.log('Invoice update data:', updateData);
        break;
      }

      case 'update_remark':
        const { remark } = body;
        updateData = { 
          remark: remark || null
        };
        console.log('Remark update data:', updateData);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update the appropriate model
    let updatedInvoice;
    try {
      if (isManualInvoice) {
        updatedInvoice = await ManualInvoice.findByIdAndUpdate(
          invoiceId,
          updateData,
          { new: true }
        );
      } else {
        updatedInvoice = await Invoice.findByIdAndUpdate(
          invoiceId,
          updateData,
          { new: true }
        ).populate('userId', 'name email phone')
         .populate('enrollmentId', 'course_title course_link category');
      }
      
      console.log('Invoice updated successfully:', !!updatedInvoice);
    } catch (updateError: any) {
      console.error('Error updating invoice:', updateError);
      return NextResponse.json(
        { error: 'Failed to update invoice in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Invoice ${action.replace('_', ' ')} updated successfully`,
      invoice: updatedInvoice
    });

  } catch (error: any) {
    console.error('UPDATE INVOICE ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// Delete invoice
export async function DELETE(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('id');

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // First, find the invoice to get image URLs before deletion
    let invoiceToDelete = null;
    let isManualInvoice = false;

    try {
      invoiceToDelete = await Invoice.findById(invoiceId);
      if (!invoiceToDelete) {
        invoiceToDelete = await ManualInvoice.findById(invoiceId);
        isManualInvoice = true;
      }
    } catch (findError: any) {
      console.error('Error finding invoice for deletion:', findError);
    }

    if (!invoiceToDelete) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Collect all image URLs from the invoice
    const imageUrls = collectInvoiceImageUrls(invoiceToDelete);
    console.log(`Found ${imageUrls.length} images to delete for invoice ${invoiceId}`);

    // Delete the invoice from database first (critical operation)
    let deletedInvoice = null;
    try {
      if (isManualInvoice) {
        deletedInvoice = await ManualInvoice.findByIdAndDelete(invoiceId);
      } else {
        deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);
      }
    } catch (deleteError: any) {
      console.error('Error deleting invoice from database:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete invoice from database' },
        { status: 500 }
      );
    }

    if (!deletedInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found or already deleted' },
        { status: 404 }
      );
    }

    // Now attempt to clean up S3 images (non-critical operation)
    // This runs after database deletion to ensure invoice deletion succeeds even if S3 cleanup fails
    if (imageUrls.length > 0) {
      try {
        console.log('Starting S3 cleanup for deleted invoice...');
        const s3Results = await deleteMultipleFromS3(imageUrls);
        
        if (s3Results.successful > 0) {
          console.log(`Successfully cleaned up ${s3Results.successful} images from S3`);
        }
        
        if (s3Results.failed > 0) {
          console.warn(`Failed to delete ${s3Results.failed} images from S3 (non-critical)`);
        }
      } catch (s3Error: any) {
        // Log S3 cleanup errors but don't fail the invoice deletion
        console.error('S3 cleanup failed (non-critical):', s3Error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
      s3Cleanup: imageUrls.length > 0 ? 'Attempted' : 'Not needed'
    });

  } catch (error: any) {
    console.error('DELETE INVOICE ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
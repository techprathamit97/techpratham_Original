import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/mongodb";
import Certificate from "@/models/Certificate.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Simple PDF generation function (you can replace with a proper PDF library)
function generateCertificatePDF(certificate: any): Buffer {
  // This is a placeholder - in a real implementation, you would use a library like:
  // - jsPDF
  // - PDFKit
  // - Puppeteer for HTML to PDF
  // - A dedicated certificate generation service
  
  const pdfContent = `
    CERTIFICATE OF COMPLETION
    
    This is to certify that
    
    ${certificate.studentName}
    
    has successfully completed the course
    
    ${certificate.courseName}
    
    with a grade of ${certificate.grade} (${certificate.score}%)
    
    Completion Date: ${new Date(certificate.completionDate).toLocaleDateString()}
    Issue Date: ${new Date(certificate.issueDate).toLocaleDateString()}
    
    Certificate ID: ${certificate.certificateId}
    Verification Code: ${certificate.verificationCode}
    
    ${certificate.customMessage || ''}
    
    TechPratham Learning Management System
  `;
  
  // Convert text to buffer (in real implementation, this would be a proper PDF)
  return Buffer.from(pdfContent, 'utf-8');
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    
    const { id } = await params;
    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    if (certificate.status !== 'issued') {
      return NextResponse.json(
        { error: "Certificate is not issued yet" },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfBuffer = generateCertificatePDF(certificate);
    
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certificate.certificateId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Certificate download error:", error);
    return NextResponse.json(
      { error: "Failed to download certificate" },
      { status: 500 }
    );
  }
}
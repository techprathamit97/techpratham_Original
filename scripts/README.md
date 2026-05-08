# Fix Installment Due Dates Script

## Purpose
This script adds the missing `dueDate` field to all existing installment payment records in the database.

## What it does
- Finds all invoices with installment payments
- For each installment that doesn't have a `dueDate`, it sets the `dueDate` to the `paidDate` (as a best guess)
- Updates both regular invoices and manual invoices

## How to run

1. Make sure you have Node.js and MongoDB connection working

2. Install mongoose if not already installed:
```bash
npm install mongoose
```

3. Run the script:
```bash
node scripts/fix-installment-due-dates.js
```

## After running
- All existing installments will have a `dueDate` field
- The due dates will be set to the payment dates (since we don't know the original due dates)
- You can manually edit individual installments using the pencil icon to correct the due dates if needed

## For new invoices
New installments added after the code fix will automatically capture and store the correct due dates.

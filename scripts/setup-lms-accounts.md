# LMS Account Setup Guide

## Quick Start

### Step 1: Access the Admin Panel
1. Login to your admin account at `/admin/dashboard`
2. Navigate to the LMS section
3. Click on "Accounts" in the sidebar (or go to `/lms/accounts`)

### Step 2: Create Student Accounts

For each enrolled student:

1. Click on the "Student Accounts" tab
2. Click "Create Account" button
3. Fill in the student details:
   - **Student ID**: Use the existing studentId from the Enrolled collection (e.g., TP000001)
   - **Full Name**: Student's full name
   - **Email**: Student's email address
   - **Phone**: Student's phone number
   - **Password**: Leave empty for auto-generation or enter a custom password

4. Click "Create Account"
5. Copy the generated credentials:
   - Student ID
   - Password
   - Login URL: `/student/login`

6. Share these credentials with the student via email or other secure method

### Step 3: Create Trainer Accounts

For each trainer:

1. Click on the "Trainer Accounts" tab
2. Click "Create Account" button
3. Fill in the trainer details:
   - **Trainer ID**: Use the existing trainerId from the Trainer collection (e.g., TR0001)
   - **Full Name**: Trainer's full name
   - **Email**: Trainer's email address (must match the email in Trainer collection)
   - **Phone**: Trainer's phone number
   - **Password**: Leave empty for auto-generation or enter a custom password

4. Click "Create Account"
5. Copy the generated credentials:
   - Trainer ID
   - Password
   - Login URL: `/trainer/login`

6. Share these credentials with the trainer via email or other secure method

## Important Notes

### For Students
- The Student ID must match an existing studentId in the Enrolled collection
- Students can only see courses they are enrolled in
- Progress tracking is automatic based on the Enrolled collection data

### For Trainers
- The Trainer ID must match an existing trainerId in the Trainer collection
- The email must match the trainer's email in batches
- Trainers can only see batches assigned to them

## Bulk Account Creation

If you need to create multiple accounts at once, you can use the API directly:

### Create Multiple Student Accounts

```javascript
// Example script to create multiple student accounts
const students = [
  { studentId: 'TP000001', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210' },
  { studentId: 'TP000002', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211' },
  // Add more students...
];

for (const student of students) {
  const response = await fetch('/api/lms/create-student-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...student,
      password: '' // Auto-generate password
    })
  });
  
  const data = await response.json();
  console.log(`Created account for ${student.name}:`, data.credentials);
}
```

### Create Multiple Trainer Accounts

```javascript
// Example script to create multiple trainer accounts
const trainers = [
  { trainerId: 'TR0001', name: 'Prof. Smith', email: 'smith@example.com', phone: '+91 9876543210' },
  { trainerId: 'TR0002', name: 'Dr. Johnson', email: 'johnson@example.com', phone: '+91 9876543211' },
  // Add more trainers...
];

for (const trainer of trainers) {
  const response = await fetch('/api/lms/create-trainer-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...trainer,
      password: '' // Auto-generate password
    })
  });
  
  const data = await response.json();
  console.log(`Created account for ${trainer.name}:`, data.credentials);
}
```

## Testing the Implementation

### Test Student Login
1. Go to `/student/login`
2. Enter a created Student ID
3. Enter the password
4. Verify you can see the dashboard with enrolled courses

### Test Trainer Login
1. Go to `/trainer/login`
2. Enter a created Trainer ID
3. Enter the password
4. Verify you can see the dashboard with assigned batches

## Troubleshooting

### "Student ID or email already exists"
- Check if an account was already created for this student
- Verify the email is unique across all student accounts

### "Trainer ID or email already exists"
- Check if an account was already created for this trainer
- Verify the email is unique across all trainer accounts

### Student can't see courses
- Verify the studentId in StudentAuth matches the studentId in Enrolled collection
- Check if the student has any enrolled courses

### Trainer can't see batches
- Verify the trainer's email in TrainerAuth matches the email in Batch.trainer.email
- Check if the trainer has any assigned batches

## Security Best Practices

1. **Password Strength**: Auto-generated passwords are 12 characters with mixed case, numbers, and special characters
2. **Secure Sharing**: Share credentials via secure channels (encrypted email, password managers)
3. **First Login**: Encourage users to change their password after first login (feature can be added)
4. **Account Deactivation**: Deactivate accounts for students/trainers who are no longer active
5. **Regular Audits**: Periodically review active accounts and remove unused ones

## Next Steps

After setting up accounts:
1. Send welcome emails to students and trainers with their credentials
2. Provide a user guide for navigating the dashboard
3. Set up support channels for login issues
4. Monitor login activity and engagement
5. Collect feedback for improvements

## Support

For technical issues or questions:
- Check the main LMS_DASHBOARDS_README.md file
- Contact the development team
- Review API logs for error messages

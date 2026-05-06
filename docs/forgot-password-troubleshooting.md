# Forgot Password - Troubleshooting Guide

## Current Error: "Email authentication failed"

This error means Gmail is rejecting the SMTP credentials. Here's how to fix it:

## Solution: Generate a New Gmail App Password

### Step 1: Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "How you sign in to Google", click "2-Step Verification"
4. Follow the prompts to enable it (if not already enabled)

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Sign in if prompted
3. Under "Select app", choose "Mail"
4. Under "Select device", choose "Other (Custom name)"
5. Enter "TechPratham SMTP" as the name
6. Click "Generate"
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update .env.local
1. Open `.env.local` file
2. Update the `SMTP_PASS` value with the new App Password (remove spaces):
   ```
   SMTP_PASS=abcdefghijklmnop
   ```
3. Save the file
4. **Restart your development server** (important!)

### Step 4: Test the Connection
1. Visit: http://localhost:3000/api/auth/test-smtp
2. You should see: `{"success":true,"message":"SMTP connection successful!"}`
3. If you see an error, check the error message for details

### Step 5: Try Forgot Password Again
1. Go to: http://localhost:3000/auth/forgot-password
2. Enter your email address
3. Click "Send Reset Link"
4. Check your email inbox (and spam folder)

## Alternative: Check Current Configuration

### Test SMTP Connection
Visit: http://localhost:3000/api/auth/test-smtp

This will show you:
- Whether SMTP credentials are configured
- Whether the connection is successful
- Specific error messages if it fails

### Common Issues

#### Issue 1: "Invalid login: 535-5.7.8 Username and Password not accepted"
**Solution:** Your App Password is incorrect or expired. Generate a new one (see steps above).

#### Issue 2: "ECONNREFUSED" or "ETIMEDOUT"
**Solution:** 
- Check your internet connection
- Verify firewall isn't blocking port 587
- Try using port 465 instead (update SMTP_PORT in .env.local)

#### Issue 3: "Less secure app access"
**Solution:** Gmail no longer supports "less secure apps". You MUST use an App Password with 2-Step Verification enabled.

## Current Configuration

Your `.env.local` should have:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=techprathamit@gmail.com
SMTP_PASS=your_16_character_app_password_here
```

## Files Modified

1. **app/api/auth/forgot-password/route.ts** - Enhanced error handling
2. **app/api/auth/reset-password/route.ts** - Better error messages
3. **lib/sendEmail.ts** - Reusable email utility (NEW)
4. **app/api/auth/test-smtp/route.ts** - SMTP testing endpoint (NEW)

## Testing Checklist

- [ ] 2-Step Verification enabled on Gmail account
- [ ] New App Password generated
- [ ] .env.local updated with new App Password
- [ ] Development server restarted
- [ ] Test SMTP endpoint returns success
- [ ] Forgot password sends email successfully
- [ ] Reset password link works
- [ ] Password reset completes successfully

## Need Help?

If you're still having issues:
1. Check the server console logs for detailed error messages
2. Visit the test endpoint: http://localhost:3000/api/auth/test-smtp
3. Verify the email account (techprathamit@gmail.com) has 2-Step Verification enabled
4. Make sure you're using an App Password, not your regular Gmail password

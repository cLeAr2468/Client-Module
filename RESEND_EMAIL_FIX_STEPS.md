# Fix Client-Module OTP Email Sending

## Problem
- ✅ **Admin/Staff emails work** (Transact-logs-system)
- ❌ **Student emails fail** (Client-Module)
- Both use the SAME backend endpoint
- Backend creates OTP successfully (visible in database)
- Email sending fails for students only

## Root Cause
**Resend API Configuration Issue:**
- Staff emails are somehow allowed to send
- Student emails (`herracrisceljane@gmail.com`) are NOT verified/allowed

## SOLUTION: Fix Resend Email Configuration

### Step 1: Get New Valid API Key (CRITICAL)

Your current API key may be invalid or restricted.

1. Go to: **https://resend.com/api-keys**
2. Log in to your Resend account
3. **Delete old/invalid API keys**
4. Click **"Create API Key"**
   - Name: `Railway Production - Full Access`
   - Permission: **Full Access** (not just "Sending")
5. **Copy the new key** (starts with `re_...`)

### Step 2: Update Railway Environment

1. Go to: **https://railway.app**
2. Open your backend service
3. Go to **Variables** tab
4. **Update or Add:**
   ```
   RESEND_API_KEY=re_YOUR_NEW_VALID_KEY_HERE
   ```
5. Click Save
6. Railway will auto-redeploy (wait 2-3 minutes)

### Step 3: Clear Backend Cache

After deployment completes:

1. Open **Railway Console** (click your backend service → Console tab)
2. Run these commands:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

### Step 4: Verify Email Addresses in Resend

**Option A: Verify Individual Emails (Quick Test)**

1. Go to: **https://resend.com/emails**
2. Click **"Add Email"** or **"Verify Email"**
3. Add student emails you want to test:
   - `herracrisceljane@gmail.com`
   - `reyesjerald638@gmail.com`
4. Each student will receive a verification email
5. They must click the verification link
6. After verified, test forgot password again

**Option B: Add Custom Domain (Best for Production)**

1. Go to: **https://resend.com/domains**
2. Click **"Add Domain"**
3. Enter your domain:
   - If you have: `nwssu.edu.ph` (official domain)
   - Or: `logssystem.com` (custom domain)
4. **Add DNS Records** (Resend will show you what to add):
   - TXT record for verification
   - MX records for email receiving (optional)
   - DKIM/SPF records for authentication
5. Wait for verification (can take 24-48 hours)
6. Update Railway variable:
   ```
   MAIL_FROM_ADDRESS=noreply@nwssu.edu.ph
   ```
7. Now you can send to **ANY email address** without verification

## Why This Happens

### Resend Free Tier Limitations:
- ✅ Can send 100 emails/day
- ✅ Can send 1 email/second
- ❌ **Can ONLY send to VERIFIED email addresses**
- ❌ Test domain `onboarding@resend.dev` has restrictions

### With Custom Domain (Paid/Verified):
- ✅ Send to ANY email address
- ✅ No per-recipient verification needed
- ✅ Professional sender address
- ✅ Better email deliverability

## Testing After Fix

### Test 1: With Verified Individual Email

1. Verify `herracrisceljane@gmail.com` in Resend
2. Open Client-Module login page
3. Click "Forgot Password"
4. Enter: `herracrisceljane@gmail.com`
5. Click "Send Code"
6. ✅ Should show: "OTP sent successfully to your email"
7. ✅ Check email inbox for OTP
8. ✅ Enter OTP and reset password

### Test 2: With Custom Domain

1. Add custom domain to Resend
2. Update `MAIL_FROM_ADDRESS` to use your domain
3. Test with ANY student email
4. ✅ All emails should work without individual verification

## Current Status Check

To check if your API key is valid:

1. Open Railway Console
2. Run:
   ```bash
   php artisan tinker
   ```
3. Test email:
   ```php
   Mail::raw('Test email', function($m) {
       $m->to('herracrisceljane@gmail.com')
         ->subject('Test from Railway');
   });
   ```
4. Check for errors:
   - ✅ If successful: `= Illuminate\Mail\SentMessage`
   - ❌ If failed: Shows error message about API key or verification

## Quick Comparison

| What | Admin (Staff) | Client (Student) | Why Different? |
|------|---------------|------------------|----------------|
| **Database** | `staff` table | `users` table | Different tables |
| **Endpoint** | `/forgot-password` | `/forgot-password` | ✅ Same |
| **Backend Code** | AuthController | AuthController | ✅ Same |
| **OTP Created** | ✅ Yes | ✅ Yes | ✅ Same |
| **Email Sent** | ✅ Works | ❌ Fails | ❌ Resend config |
| **Email Address** | Staff email | Student email | **Different verification** |

## Action Plan (Do This Now)

1. ✅ **URGENT:** Get new Resend API key → Update Railway
2. ✅ Verify student email in Resend dashboard
3. ✅ Test forgot password with verified email
4. ✅ Plan to add custom domain for production

## If Still Not Working After These Steps

1. **Check Railway Logs:**
   - Railway Dashboard → Your service → Logs tab
   - Look for email errors
   - Look for Resend API errors

2. **Check Resend Dashboard:**
   - Go to: https://resend.com/emails
   - Look at "Failed" emails
   - Check error messages

3. **Common Errors:**
   - "API key is invalid" → Get new key
   - "Email not verified" → Verify email in Resend
   - "Rate limit exceeded" → Wait or upgrade plan
   - "Domain not verified" → Verify domain

## Production Recommendation

**Best Practice for Production:**
1. ✅ Use custom domain (`nwssu.edu.ph`)
2. ✅ Use professional sender address (`noreply@nwssu.edu.ph`)
3. ✅ No need to verify each student email
4. ✅ Better email deliverability
5. ✅ More professional appearance

**Cost:**
- Resend custom domain: **FREE**
- You just need access to your domain's DNS settings
- Contact your IT department for DNS access

---

## Summary

The backend code is **correct** and works for admin. The issue is **Resend email configuration**:
- Admin emails work = Staff emails are somehow verified/allowed
- Student emails fail = NOT verified in Resend

**Fix:** Update Resend API key and verify student emails OR add custom domain.

No code changes needed! Just Resend configuration. 🎯

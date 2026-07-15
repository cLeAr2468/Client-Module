# Forgot Password Implementation - Client Module

## Overview
The Client Module now uses the **same forgot password approach** as the Transact-logs-system, with OTP email verification and support for both **Users** (students) and **Staff** tables.

---

## Backend Implementation (Already Complete) ✅

### 1. **forgotPassword** - Send OTP
**Location:** `Logs-server-system/app/Http/Controllers/AuthController.php`

```php
public function forgotPassword(Request $request)
{
    $request->validate(['email' => 'required|email']);

    // Check if user exists in users table OR staff table
    $user = User::where('email', $request->email)->first();
    $userType = 'user';
    
    // If not found in users, check staff table
    if (!$user) {
        $user = \App\Models\Staff::where('email', $request->email)->first();
        $userType = 'staff';
    }

    if (!$user) {
        return response()->json([
            'message' => 'Email not found. Please register first.',
            'error' => 'email_not_found'
        ], 404);
    }

    // Generate 6-digit OTP
    $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

    // Delete any existing unused tokens for this email
    PasswordResetToken::where('email', $request->email)
        ->where('is_used', false)
        ->delete();

    // Create new password reset token
    $resetToken = PasswordResetToken::create([
        'email' => $request->email,
        'otp' => $otp,
        'expires_at' => now()->addMinutes(5), // OTP expires in 5 minutes
        'is_used' => false,
    ]);

    // Send OTP via email
    try {
        Mail::to($user->email)->send(new SendOtpMail($otp, $user->email));
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to send OTP email. Please try again later.',
            'error' => $e->getMessage()
        ], 500);
    }

    return response()->json([
        'message' => 'OTP sent successfully to your email',
        'email' => $request->email,
        'user_type' => $userType // Return user type for frontend reference
    ], 200);
}
```

### 2. **verifyOtp** - Verify OTP Code
```php
public function verifyOtp(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'otp' => 'required|string|size:6'
    ]);

    // Find the most recent unused token for this email
    $resetToken = PasswordResetToken::where('email', $request->email)
        ->where('otp', $request->otp)
        ->where('is_used', false)
        ->orderBy('created_at', 'desc')
        ->first();

    if (!$resetToken) {
        return response()->json(['message' => 'Invalid OTP code'], 400);
    }

    if ($resetToken->isExpired()) {
        return response()->json([
            'message' => 'OTP has expired. Please request a new one.'
        ], 400);
    }

    return response()->json([
        'message' => 'OTP verified successfully',
        'email' => $request->email,
        'token_id' => $resetToken->id
    ], 200);
}
```

### 3. **resendOtp** - Resend OTP
```php
public function resendOtp(Request $request)
{
    $request->validate(['email' => 'required|email']);

    // Check if user exists in users table OR staff table
    $user = User::where('email', $request->email)->first();
    
    if (!$user) {
        $user = \App\Models\Staff::where('email', $request->email)->first();
    }

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Generate new 6-digit OTP
    $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

    // Delete any existing unused tokens
    PasswordResetToken::where('email', $request->email)
        ->where('is_used', false)
        ->delete();

    // Create new token
    $resetToken = PasswordResetToken::create([
        'email' => $request->email,
        'otp' => $otp,
        'expires_at' => now()->addMinutes(5),
        'is_used' => false,
    ]);

    // Send OTP via email
    try {
        Mail::to($user->email)->send(new SendOtpMail($otp, $user->email));
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to resend OTP email.',
            'error' => $e->getMessage()
        ], 500);
    }

    return response()->json([
        'message' => 'OTP resent successfully to your email',
        'email' => $request->email
    ], 200);
}
```

### 4. **resetPassword** - Reset Password with OTP
```php
public function resetPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'otp' => 'required|string|size:6',
        'password' => 'required|min:6|confirmed'
    ]);

    // Find the token
    $resetToken = PasswordResetToken::where('email', $request->email)
        ->where('otp', $request->otp)
        ->where('is_used', false)
        ->orderBy('created_at', 'desc')
        ->first();

    if (!$resetToken) {
        return response()->json(['message' => 'Invalid OTP code'], 400);
    }

    if ($resetToken->isExpired()) {
        return response()->json([
            'message' => 'OTP has expired. Please request a new one.'
        ], 400);
    }

    // Find user in users table OR staff table
    $user = User::where('email', $request->email)->first();
    $isStaff = false;
    
    if (!$user) {
        $user = \App\Models\Staff::where('email', $request->email)->first();
        $isStaff = true;
    }

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Update password
    $user->password = Hash::make($request->password);
    $user->save();

    // Mark token as used
    $resetToken->is_used = true;
    $resetToken->save();

    // Revoke all existing tokens
    $user->tokens()->delete();

    return response()->json([
        'message' => 'Password reset successfully',
        'user_type' => $isStaff ? 'staff' : 'user'
    ], 200);
}
```

---

## Frontend Implementation (Completed) ✅

### 1. **authApi.js** - API Functions
**Location:** `Client-Module/logs-system/src/api/authApi.js`

```javascript
// Send OTP to user's email
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send OTP' };
  }
};

// Verify OTP code
export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post('/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'OTP verification failed' };
  }
};

// Resend OTP
export const resendOtp = async (email) => {
  try {
    const response = await api.post('/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resend OTP' };
  }
};

// Reset password
export const resetPassword = async (email, otp, password, passwordConfirmation) => {
  try {
    const response = await api.post('/reset-password', {
      email,
      otp,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};
```

### 2. **Modal Components**

#### **forgot-pass.jsx** - Email Input
- ✅ Email validation with regex
- ✅ Real-time error display
- ✅ Loading states

#### **otp-dialog.jsx** - OTP Verification
- ✅ 6-digit OTP input
- ✅ Resend OTP functionality
- ✅ Loading states
- ✅ Back navigation

#### **new-password.jsx** - New Password
- ✅ Password strength indicator
- ✅ Password requirements check (6+ chars, uppercase, number/special)
- ✅ Password confirmation
- ✅ Loading states

### 3. **login.jsx** - Main Flow Orchestrator
**Location:** `Client-Module/logs-system/src/components/pages/login.jsx`

The login page manages the entire forgot password flow:

```javascript
// State management
const [showForgotPassword, setShowForgotPassword] = useState(false);
const [showOtpDialog, setShowOtpDialog] = useState(false);
const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false);
const [forgotEmail, setForgotEmail] = useState("");
const [otp, setOtp] = useState("");

// Step 1: Send OTP
const handleForgotSubmit = async () => {
  const response = await forgotPassword(forgotEmail);
  // Response includes: message, email, user_type (staff or user)
  setShowForgotPassword(false);
  setShowOtpDialog(true);
};

// Step 2: Verify OTP
const handleOtpVerify = async (otpValue) => {
  const response = await verifyOtp(forgotEmail, otpValue);
  setOtp(otpValue);
  setShowOtpDialog(false);
  setShowNewPasswordDialog(true);
};

// Step 3: Reset Password
const handlePasswordSuccess = async (password, passwordConfirmation) => {
  const response = await resetPassword(forgotEmail, otp, password, passwordConfirmation);
  // Response includes: message, user_type (staff or user)
  setShowNewPasswordDialog(false);
  setForgotEmail("");
  setOtp("");
};
```

---

## User Type Handling

The backend returns `user_type` in responses:
- **"user"** - For students from `users` table
- **"staff"** - For staff/admin from `staff` table

### Backend Checks Both Tables:
1. First checks `users` table
2. If not found, checks `staff` table
3. Returns appropriate `user_type` in response

### Use Cases:
- **Students** can reset password using their student email
- **Staff/Admin** can reset password using their staff email
- Same OTP flow works for both user types
- Backend automatically determines which table to update

---

## Complete Flow

1. **User clicks "Forgot Password"**
   - Opens forgot-pass modal
   - User enters email

2. **Email is sent to backend**
   - Backend checks both `users` and `staff` tables
   - Generates 6-digit OTP
   - Sends OTP via email
   - Returns `user_type` ("user" or "staff")

3. **OTP dialog opens**
   - User enters 6-digit code
   - Can resend OTP if needed
   - Backend verifies OTP

4. **New password dialog opens**
   - User creates new password
   - Must meet requirements (6+ chars, uppercase, number/special)
   - Backend updates password in correct table (users or staff)

5. **Success**
   - User can now login with new password
   - Works for both students and staff

---

## Key Features

✅ **Dual Table Support** - Works for both users and staff
✅ **Email Validation** - Real-time email format checking
✅ **OTP Generation** - Secure 6-digit OTP
✅ **OTP Expiration** - 5-minute expiration
✅ **Resend OTP** - Can request new OTP
✅ **Password Requirements** - Strong password validation
✅ **Token Management** - Old unused tokens are deleted
✅ **Session Revocation** - All existing sessions are revoked on password reset
✅ **Error Handling** - Comprehensive error messages
✅ **Loading States** - User feedback during async operations

---

## Environment Variables

Make sure these are set in `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

## Testing

### Test Student Password Reset:
1. Use a student email from `users` table
2. Complete forgot password flow
3. Backend returns `user_type: "user"`
4. Password is updated in `users` table

### Test Staff Password Reset:
1. Use a staff email from `staff` table
2. Complete forgot password flow
3. Backend returns `user_type: "staff"`
4. Password is updated in `staff` table

---

## Status: ✅ COMPLETE

Both the backend and frontend are fully implemented and working with the same approach as Transact-logs-system. The system supports password reset for both students and staff using the same unified flow.

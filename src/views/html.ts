export const OTPTEMPLATE = `<div style="background-color: #f4f4f4; font-family: sans-serif;">    
<div style="background-color: #ffffff; max-width: 600px; margin: auto; border-radius: 10px; overflow: hidden;">
  <div style="padding: 30px;">
    <h1 style="color: #333333; font-size: 28px; font-weight: 700; margin-bottom: 30px; text-align: center;">OTP Verification</h1>
    <p style="color: #666666; font-size: 16px; line-height: 24px; margin-bottom: 30px; text-align: center;">Dear {##name##},</p>
    <p style="color: #666666; font-size: 16px; line-height: 24px; margin-bottom: 30px; text-align: center;">Please use the following One-Time Password (OTP) to verify your email address:</p>
    <div style="background-color: #f5f5f5; border-radius: 5px; padding: 20px; text-align: center; font-size: 24px; font-weight: 700; margin-bottom: 30px;">
      {##otp##}
    </div>
    <p style="color: #666666; font-size: 16px; line-height: 24px; margin-bottom: 30px; text-align: center;">This OTP will expire in 10 minutes. If you did not request this OTP, please ignore this email.</p>
  </div>
</div>
</div>
`

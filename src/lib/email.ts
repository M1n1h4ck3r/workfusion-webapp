interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export const emailTemplates = {
  welcome: (userName: string, verificationUrl: string): EmailTemplate => ({
    subject: 'Welcome to WorkFusion - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to WorkFusion</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: rgba(26, 26, 26, 0.95);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .header {
              background: linear-gradient(135deg, #00DC82 0%, #36E4DA 50%, #0047E1 100%);
              padding: 40px;
              text-align: center;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: white;
              text-decoration: none;
            }
            .content {
              padding: 40px;
              color: #e0e0e0;
            }
            h1 {
              color: #ffffff;
              margin: 0 0 24px;
              font-size: 28px;
            }
            p {
              margin: 0 0 16px;
              color: #b0b0b0;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #00DC82 0%, #36E4DA 50%, #0047E1 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 24px 0;
              font-size: 16px;
            }
            .features {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 12px;
              padding: 24px;
              margin: 32px 0;
            }
            .feature {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              color: #b0b0b0;
            }
            .feature-icon {
              width: 24px;
              height: 24px;
              margin-right: 12px;
              background: #00DC82;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .footer {
              padding: 24px 40px;
              background: rgba(0, 0, 0, 0.3);
              text-align: center;
              color: #808080;
              font-size: 14px;
            }
            .footer a {
              color: #00DC82;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <a href="https://workfusion.pro" class="logo">WorkFusion</a>
            </div>
            
            <div class="content">
              <h1>Welcome to WorkFusion, ${userName}! 🎉</h1>
              
              <p>Thank you for joining WorkFusion - your AI-powered agency for next-generation automation and productivity.</p>
              
              <p>Please verify your email address to activate your account and get started with 500 free tokens!</p>
              
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              
              <div class="features">
                <h3 style="color: #ffffff; margin-top: 0;">What you can do with WorkFusion:</h3>
                <div class="feature">
                  <span class="feature-icon">✓</span>
                  <span>Chat with AI personalities like Alex Hormozi and Jordan Peterson</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">✓</span>
                  <span>Automate WhatsApp messaging and voice calls</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">✓</span>
                  <span>Generate content and automate your blog</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">✓</span>
                  <span>Convert text to natural speech</span>
                </div>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #00DC82;">${verificationUrl}</p>
            </div>
            
            <div class="footer">
              <p>© 2024 WorkFusion. All rights reserved.</p>
              <p>
                <a href="https://workfusion.pro/terms">Terms</a> • 
                <a href="https://workfusion.pro/privacy">Privacy</a> • 
                <a href="https://workfusion.pro/support">Support</a>
              </p>
              <p>This email was sent to ${userName}. If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to WorkFusion, ${userName}!

Thank you for joining WorkFusion - your AI-powered agency for next-generation automation and productivity.

Please verify your email address to activate your account and get started with 500 free tokens!

Verify your email: ${verificationUrl}

What you can do with WorkFusion:
✓ Chat with AI personalities like Alex Hormozi and Jordan Peterson
✓ Automate WhatsApp messaging and voice calls
✓ Generate content and automate your blog
✓ Convert text to natural speech

If you have any questions, please don't hesitate to contact our support team.

© 2024 WorkFusion. All rights reserved.
    `
  }),

  passwordReset: (userName: string, resetUrl: string): EmailTemplate => ({
    subject: 'Reset Your WorkFusion Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: rgba(26, 26, 26, 0.95);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .header {
              background: linear-gradient(135deg, #00DC82 0%, #36E4DA 50%, #0047E1 100%);
              padding: 40px;
              text-align: center;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: white;
              text-decoration: none;
            }
            .content {
              padding: 40px;
              color: #e0e0e0;
            }
            h1 {
              color: #ffffff;
              margin: 0 0 24px;
              font-size: 28px;
            }
            p {
              margin: 0 0 16px;
              color: #b0b0b0;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #00DC82 0%, #36E4DA 50%, #0047E1 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 24px 0;
              font-size: 16px;
            }
            .warning {
              background: rgba(255, 193, 7, 0.1);
              border: 1px solid rgba(255, 193, 7, 0.3);
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
              color: #ffc107;
            }
            .footer {
              padding: 24px 40px;
              background: rgba(0, 0, 0, 0.3);
              text-align: center;
              color: #808080;
              font-size: 14px;
            }
            .footer a {
              color: #00DC82;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <a href="https://workfusion.pro" class="logo">WorkFusion</a>
            </div>
            
            <div class="content">
              <h1>Reset Your Password</h1>
              
              <p>Hi ${userName},</p>
              
              <p>We received a request to reset your WorkFusion password. Click the button below to create a new password:</p>
              
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                This link will expire in 1 hour for your security. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #00DC82;">${resetUrl}</p>
            </div>
            
            <div class="footer">
              <p>© 2024 WorkFusion. All rights reserved.</p>
              <p>
                <a href="https://workfusion.pro/terms">Terms</a> • 
                <a href="https://workfusion.pro/privacy">Privacy</a> • 
                <a href="https://workfusion.pro/support">Support</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Reset Your Password

Hi ${userName},

We received a request to reset your WorkFusion password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour for your security.

If you didn't request this password reset, please ignore this email and your password will remain unchanged.

© 2024 WorkFusion. All rights reserved.
    `
  }),

  tokenPurchase: (userName: string, tokens: number, amount: string): EmailTemplate => ({
    subject: 'Token Purchase Confirmation - WorkFusion',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Purchase Confirmation</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: rgba(26, 26, 26, 0.95);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .header {
              background: linear-gradient(135deg, #00DC82 0%, #36E4DA 50%, #0047E1 100%);
              padding: 40px;
              text-align: center;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: white;
              text-decoration: none;
            }
            .content {
              padding: 40px;
              color: #e0e0e0;
            }
            h1 {
              color: #ffffff;
              margin: 0 0 24px;
              font-size: 28px;
            }
            p {
              margin: 0 0 16px;
              color: #b0b0b0;
            }
            .receipt {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 12px;
              padding: 24px;
              margin: 24px 0;
            }
            .receipt-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              color: #b0b0b0;
            }
            .receipt-row:last-child {
              border-bottom: none;
              padding-top: 16px;
              font-size: 20px;
              font-weight: bold;
              color: #ffffff;
            }
            .success-badge {
              display: inline-block;
              background: rgba(0, 220, 130, 0.2);
              color: #00DC82;
              padding: 8px 16px;
              border-radius: 8px;
              font-weight: 600;
              margin: 16px 0;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #00DC82 0%, #36E4DA 50%, #0047E1 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 24px 0;
              font-size: 16px;
            }
            .footer {
              padding: 24px 40px;
              background: rgba(0, 0, 0, 0.3);
              text-align: center;
              color: #808080;
              font-size: 14px;
            }
            .footer a {
              color: #00DC82;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <a href="https://workfusion.pro" class="logo">WorkFusion</a>
            </div>
            
            <div class="content">
              <h1>Payment Successful! 🎉</h1>
              
              <p>Hi ${userName},</p>
              
              <p>Thank you for your purchase! Your tokens have been added to your account.</p>
              
              <div class="success-badge">✓ ${tokens.toLocaleString()} tokens added to your account</div>
              
              <div class="receipt">
                <h3 style="color: #ffffff; margin-top: 0;">Receipt</h3>
                <div class="receipt-row">
                  <span>Token Package</span>
                  <span>${tokens.toLocaleString()} tokens</span>
                </div>
                <div class="receipt-row">
                  <span>Date</span>
                  <span>${new Date().toLocaleDateString()}</span>
                </div>
                <div class="receipt-row">
                  <span>Payment Method</span>
                  <span>Card ending in ****</span>
                </div>
                <div class="receipt-row">
                  <span>Total Paid</span>
                  <span>$${amount}</span>
                </div>
              </div>
              
              <center>
                <a href="https://workfusion.pro/dashboard" class="button">Go to Dashboard</a>
              </center>
              
              <p>A copy of your invoice has been saved to your account and can be downloaded from the billing section.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 WorkFusion. All rights reserved.</p>
              <p>
                <a href="https://workfusion.pro/terms">Terms</a> • 
                <a href="https://workfusion.pro/privacy">Privacy</a> • 
                <a href="https://workfusion.pro/support">Support</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Payment Successful!

Hi ${userName},

Thank you for your purchase! Your tokens have been added to your account.

✓ ${tokens.toLocaleString()} tokens added to your account

Receipt:
- Token Package: ${tokens.toLocaleString()} tokens
- Date: ${new Date().toLocaleDateString()}
- Total Paid: $${amount}

You can view your updated balance and usage history at:
https://workfusion.pro/dashboard

© 2024 WorkFusion. All rights reserved.
    `
  })
}

// Email sending function (requires email service configuration)
export async function sendEmail(
  to: string,
  template: EmailTemplate
): Promise<void> {
  // TODO: Implement actual email sending with a service like SendGrid, AWS SES, or Resend
  
  console.log('Email would be sent:', {
    to,
    subject: template.subject,
    // In production, send actual email
  })
  
  // For development, just log the email
  if (process.env.NODE_ENV === 'development') {
    console.log('Email HTML Preview:', template.html)
  }
}
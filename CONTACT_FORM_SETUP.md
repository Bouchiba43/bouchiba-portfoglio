# Secure Contact Form Setup Guide

This guide will help you set up the secure contact form workflow with email verification and automated responses using free services.

## 🔧 Required Services Setup

### 1. Resend (Email Sending Service)
**Free tier: 100 emails/day, 3,000 emails/month**

1. **Create Account:**
   - Go to [resend.com](https://resend.com)
   - Sign up with your email
   - Verify your account

2. **Add Your Domain:**
   - Go to Domains → Add Domain
   - Enter `ahmedbouchiba.com`
   - Follow the DNS setup instructions

3. **DNS Configuration:**
   Add these DNS records to your domain (through your domain registrar):
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all

   Type: CNAME
   Name: resend._domainkey
   Value: resend._domainkey.resend.com

   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@ahmedbouchiba.com
   ```

4. **Get API Key:**
   - Go to API Keys → Create API Key
   - Copy the key and add it to your `.env.local`:
   ```env
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

### 2. Mailboxlayer (Email Verification)
**Free tier: 250 verifications/month**

1. **Create Account:**
   - Go to [mailboxlayer.com](https://mailboxlayer.com)
   - Sign up for free account
   - Verify your email

2. **Get API Key:**
   - Go to Dashboard
   - Copy your API Access Key
   - Add it to your `.env.local`:
   ```env
   MAILBOXLAYER_API_KEY=your_actual_api_key_here
   ```

### 3. Email Forwarding Setup

#### Option A: ImprovMX (Recommended)
**Free tier: 10 aliases**

1. **Setup:**
   - Go to [improvmx.com](https://improvmx.com)
   - Add your domain `ahmedbouchiba.com`
   - Create alias: `contact@ahmedbouchiba.com` → `Bouchibaahmed43@gmail.com`

2. **DNS Configuration:**
   Add these MX records:
   ```
   Type: MX
   Name: @
   Value: mx1.improvmx.com (Priority: 10)
   Value: mx2.improvmx.com (Priority: 20)
   ```

#### Option B: Cloudflare Email Routing
**Free tier: Unlimited aliases**

1. **Setup:**
   - Add your domain to Cloudflare
   - Go to Email → Email Routing
   - Enable Email Routing
   - Add rule: `contact@ahmedbouchiba.com` → `Bouchibaahmed43@gmail.com`

## 📧 Email Configuration

Update your `.env.local` with the correct email addresses:

```env
# Email Service Configuration (Resend)
RESEND_API_KEY=re_your_actual_resend_api_key_here

# Email Verification Service (Mailboxlayer)
MAILBOXLAYER_API_KEY=your_actual_mailboxlayer_api_key_here

# Contact Email Settings
CONTACT_FROM_EMAIL=contact@ahmedbouchiba.com
CONTACT_TO_EMAIL=Bouchibaahmed43@gmail.com
```

## 🧪 Testing the Setup

### 1. Test Email Verification
```bash
# Test with a valid email
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@gmail.com",
    "message": "This is a test message with valid email"
  }'

# Test with invalid email
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid@nonexistentdomain12345.com",
    "message": "This should fail email verification"
  }'
```

### 2. Test Form Validation
```bash
# Test with short message (should fail)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@gmail.com", 
    "message": "Short"
  }'

# Test with long name (should fail)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "This is a very long name that exceeds fifty characters limit",
    "email": "test@gmail.com",
    "message": "This message should fail due to long name"
  }'
```

## 🔒 Security Features Implemented

- ✅ **Real Email Verification**: Uses Mailboxlayer to verify email exists and is deliverable
- ✅ **Input Validation**: Comprehensive validation with Zod schema
- ✅ **Input Sanitization**: Removes potentially harmful characters
- ✅ **Rate Limiting**: Built-in through service providers
- ✅ **Secure Storage**: Messages stored in Firebase with metadata
- ✅ **No Client-Side Secrets**: All API keys are server-side only

## 📨 Email Templates

### Notification Email (to you)
- Professional format with sender details
- Message content preserved with formatting
- Reply-to set to sender's email
- Timestamp and metadata included

### Thank You Email (to sender)
- Branded with your portfolio design
- Sets expectations (24-48 hour response)
- Includes links to your social profiles
- Helpful tips for urgent inquiries

## 🚀 Deployment Notes

### Environment Variables for Production
Make sure to set these in your production environment:
```env
RESEND_API_KEY=your_production_resend_key
MAILBOXLAYER_API_KEY=your_production_mailboxlayer_key
CONTACT_FROM_EMAIL=contact@ahmedbouchiba.com
CONTACT_TO_EMAIL=Bouchibaahmed43@gmail.com
```

### Monitoring & Analytics
- Check Resend dashboard for email delivery stats
- Monitor Mailboxlayer usage to stay within limits
- Review Firebase contact collection for submissions

## 🔧 Troubleshooting

### Email Not Sending
1. Check Resend API key is correct
2. Verify domain DNS records are properly configured
3. Check Resend dashboard for failed deliveries

### Email Verification Failing
1. Verify Mailboxlayer API key
2. Check API usage limits
3. Review console logs for specific errors

### Form Not Submitting
1. Check browser console for errors
2. Verify Firebase configuration
3. Check network requests in browser dev tools

## 📊 Usage Limits (Free Tiers)

| Service | Free Limit | Reset Period |
|---------|------------|--------------|
| Resend | 100 emails/day, 3,000/month | Daily/Monthly |
| Mailboxlayer | 250 verifications | Monthly |
| ImprovMX | 10 aliases | N/A |
| Cloudflare | Unlimited | N/A |

## 🎯 Next Steps

1. Set up all three services following this guide
2. Update your `.env.local` with real API keys
3. Test the contact form thoroughly
4. Deploy to production
5. Monitor usage and deliverability

The contact form is now production-ready with enterprise-level features using only free services!
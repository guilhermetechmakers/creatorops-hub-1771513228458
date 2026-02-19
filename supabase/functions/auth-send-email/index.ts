// Supabase Edge Function: Custom auth email sending via SendGrid
// Configure SENDGRID_API_KEY in Supabase secrets
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
const SENDGRID_FROM = Deno.env.get('SENDGRID_FROM') ?? 'noreply@creatoropshub.com'

interface SendEmailRequest {
  to: string
  subject: string
  html: string
  text?: string
}

async function sendSendGridEmail(req: SendEmailRequest): Promise<{ error?: string }> {
  if (!SENDGRID_API_KEY) {
    return { error: 'SendGrid not configured' }
  }

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: req.to }] }],
      from: { email: SENDGRID_FROM, name: 'CreatorOps Hub' },
      subject: req.subject,
      content: [
        { type: 'text/plain', value: req.text ?? req.html.replace(/<[^>]*>/g, '') },
        { type: 'text/html', value: req.html },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return { error: `SendGrid error: ${err}` }
  }
  return {}
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const { type, email, token } = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (type === 'verification') {
      const { error } = await supabase.auth.resend({ type: 'signup', email })
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (type === 'password_reset' && token) {
      const resetLink = `${Deno.env.get('SITE_URL') ?? 'http://localhost:5173'}/reset-password#access_token=${token}&type=recovery`
      const { error } = await sendSendGridEmail({
        to: email,
        subject: 'Reset your CreatorOps Hub password',
        html: `
          <p>You requested a password reset. Click the link below:</p>
          <p><a href="${resetLink}">Reset password</a></p>
          <p>This link expires in 1 hour.</p>
        `,
      })
      if (error) {
        return new Response(JSON.stringify({ error }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

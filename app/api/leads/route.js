import { createServerClient } from '@supabase/ssr';
import { Resend } from 'resend';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      full_name, 
      email, 
      phone, 
      travel_date, 
      adults, 
      children, 
      budget, 
      special_requests, 
      package_id, 
      package_title, 
      package_price 
    } = body;

    // 1. Initialize Supabase with Service Role Key for Admin privileges
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // 2. Save Lead to Database
    const { data: lead, error } = await supabase.from('leads').insert({
      full_name,
      email,
      phone,
      travel_date,
      adults,
      children,
      budget,
      special_requests,
      package_id,
      package_title,
      package_price,
      status: 'new',
      created_at: new Date().toISOString()
    }).select().single();

    if (error) throw error;

    // 3. Notify Admin via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'RM Yaatra Leads <leads@rmyaatravels.com>',
        to: process.env.ADMIN_EMAIL || 'info@rmyaatravels.com',
        subject: `🔔 New Lead: ${full_name} — ${package_title}`,
        html: `
          <div style="font-family: sans-serif; color: #1A2D42;">
            <h2 style="color: #E8A020;">New Package Enquiry</h2>
            <p>A new lead has been captured for the package: <strong>${package_title}</strong></p>
            
            <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; border: 1px solid #E5E0D8;">
              <tr style="background: #F7F4EF;">
                <td style="width: 150px;"><strong>Customer Name</strong></td>
                <td>${full_name}</td>
              </tr>
              <tr>
                <td><strong>Phone / WhatsApp</strong></td>
                <td><a href="tel:${phone}">${phone}</a></td>
              </tr>
              <tr>
                <td><strong>Email Address</strong></td>
                <td><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr style="background: #F7F4EF;">
                <td><strong>Package Title</strong></td>
                <td>${package_title}</td>
              </tr>
              <tr>
                <td><strong>Package Price</strong></td>
                <td>₹${Number(package_price).toLocaleString()}</td>
              </tr>
              <tr>
                <td><strong>Travel Date</strong></td>
                <td>${travel_date}</td>
              </tr>
              <tr style="background: #F7F4EF;">
                <td><strong>Travelers</strong></td>
                <td>${adults} Adults, ${children} Children</td>
              </tr>
              <tr>
                <td><strong>Budget</strong></td>
                <td>${budget}</td>
              </tr>
              <tr>
                <td><strong>Special Requests</strong></td>
                <td>${special_requests || 'No specific requests.'}</td>
              </tr>
            </table>
            
            <p style="margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads" style="display: inline-block; padding: 12px 24px; background: #E8A020; color: #0D1B2A; text-decoration: none; border-radius: 8px; font-weight: 700;">
                View Lead in Dashboard →
              </a>
            </p>
          </div>
        `
      });
    }

    return Response.json({ success: true, leadId: lead.id });

  } catch (err) {
    console.error('Lead Submission Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

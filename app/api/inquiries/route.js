import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const inquiryData = await request.json();
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          package_id: inquiryData.package_id,
          package_title: inquiryData.package_title,
          customer_name: inquiryData.customer_name,
          customer_email: inquiryData.customer_email,
          customer_phone: inquiryData.customer_phone,
          travel_date: inquiryData.travel_date,
          travelers_count: inquiryData.travelers_count,
          message: inquiryData.message,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, id: data.id });

  } catch (err) {
    console.error('Inquiry Submission Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

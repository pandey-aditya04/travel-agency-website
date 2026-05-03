import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const pkg = await request.json();
    const cookieStore = await cookies();
    
    // Auth check: Use a custom secret or verify JWT
    // For now, we assume the user has the secret role key in env
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {}, // Admin actions don't need to set client cookies
        },
      }
    );

    const { data, error } = await supabase
      .from('packages')
      .insert({
        ...pkg,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, id: data.id });

  } catch (err) {
    console.error('Package Create Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

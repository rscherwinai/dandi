import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET all keys
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// CREATE new key
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.name) {
      console.error('Missing key name');
      return NextResponse.json(
        { error: 'Key name is required' }, 
        { status: 400 }
      );
    }

    const apiKey = 'tvly_' + Array(32)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('');

    console.log('Attempting to insert key with name:', body.name);
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          name: body.name,
          key: apiKey,
          usage: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }

    console.log('Successfully created key:', data.id);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();
    console.log('Received API key:', apiKey);
    
    if (!apiKey) {
      return NextResponse.json(
        { message: 'API key is required' }, 
        { status: 400 }
      );
    }

    // Query the api_keys table using your existing supabase client
    const { data: keyData, error } = await supabase
      .from('api_keys')
      .select('id, name, key, usage')
      .eq('key', apiKey)
      .single();

    console.log('Query result:', { keyData, error });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { message: 'Error validating API key', error: error.message }, 
        { status: 500 }
      );
    }

    if (!keyData) {
      return NextResponse.json(
        { message: 'Invalid API key' }, 
        { status: 401 }
      );
    }

    // If we get here, the key is valid
    return NextResponse.json(
      { 
        message: 'Valid API key', 
        keyId: keyData.id,
        keyName: keyData.name,
        usage: keyData.usage,
        debug: { keyData }
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message }, 
      { status: 500 }
    );
  }
} 
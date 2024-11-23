import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(req, { params }) {
  try {
    // Create a new URL object from the request URL
    const url = new URL(req.url);
    // Get the ID from the URL pathname
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    console.log('Attempting to delete key:', id);

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Key deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    // Get the ID from params
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    // Get the updated name from request body
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Update the key in Supabase
    const { data, error } = await supabase
      .from('api_keys')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Return the updated key data
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error updating key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

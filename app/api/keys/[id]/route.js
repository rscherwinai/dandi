import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Make sure we're using the correct imports
import { headers } from 'next/headers';

export async function PUT(request, context) {
  try {
    const id = context.params.id;  // Get ID from context
    console.log('Attempting to update key:', id);

    // Get the request body
    const body = await request.json();
    
    if (!id || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('api_keys')
      .update({ name: body.name })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update failed:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in PUT handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Similar pattern for DELETE
export async function DELETE(request, context) {
  try {
    const id = context.params.id;
    console.log('Attempting to delete key:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete failed:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Key deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

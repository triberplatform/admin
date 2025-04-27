import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function PUT(request: Request) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Log for debugging
    console.log('Auth header received in business suspend API route:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.warn('Authentication header missing in business suspend API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const payload = await request.json();
    
    // Forward to backend with auth token
    const response = await serverFetch('/admin/business/suspend', {
      method: 'PUT',
      headers: {
        'Authorization': authHeader
      },
      data: payload,
    });
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Business suspend error:', error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message ||
      error.message ||
      'Failed to suspend business';
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
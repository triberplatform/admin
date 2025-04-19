// /app/api/users/suspend/route.ts
import { suspendPayload } from "@/app/types/payload";
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function POST(request: Request) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Log for debugging
    console.log('Auth header received in suspend API route:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.warn('Authentication header missing in suspend API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const payload = await request.json();
    
    // Forward to backend with auth token
    const userData = await serverFetch('/admin/users/suspend', {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      },
      data: payload,
    });
    
    return NextResponse.json(userData);
  } catch (error: any) {
    console.error('Suspend error:', error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message || 
      error.message || 
      'Failed to suspend user';
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
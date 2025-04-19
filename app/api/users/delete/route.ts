// /app/api/users/delete/route.ts
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function DELETE(request: Request) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Try to parse JSON body with error handling
    let userId;
    try {
      // Check if request has a body before trying to parse it
      const contentType = request.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await request.text();
        if (text) {
          const body = JSON.parse(text);
          userId = body.userId;
        }
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Handle case where userId might come from URL params if not in body
    if (!userId) {
      // Try to get userId from URL or query params if available
      const url = new URL(request.url);
      userId = url.searchParams.get('userId');
    }
    
    // Log for debugging
    console.log('Auth header received in API route:', authHeader ? 'Present' : 'Missing');
    console.log('Deleting user with ID:', userId);
    
    if (!authHeader) {
      console.warn('Authentication header missing in API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!userId) {
      console.warn('User ID missing in delete request');
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // For Axios, use data property instead of body
    const response = await serverFetch('/api/admin/business/delete', {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      data: { userId } // Use data instead of body for Axios
    });
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message ||
      error.message ||
      'Failed to delete user';
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
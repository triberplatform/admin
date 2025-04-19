// /app/api/business/delete/route.ts
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function DELETE(request: Request) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Try to parse JSON body with error handling
    let businessId;
    try {
      // Check if request has a body before trying to parse it
      const contentType = request.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await request.text();
        if (text) {
          const body = JSON.parse(text);
          businessId = body.businessId;
        }
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Handle case where businessId might come from URL params if not in body
    if (!businessId) {
      // Try to get businessId from URL or query params if available
      const url = new URL(request.url);
      businessId = url.searchParams.get('businessId');
    }
    
    // Log for debugging
    console.log('Auth header received in API route:', authHeader ? 'Present' : 'Missing');
    console.log('Deleting business with ID:', businessId);
    
    if (!authHeader) {
      console.warn('Authentication header missing in API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!businessId) {
      console.warn('Business ID missing in delete request');
      return NextResponse.json(
        { success: false, message: 'Business ID is required' },
        { status: 400 }
      );
    }
    
    // For Axios, use data property instead of body
    const response = await serverFetch('/admin/business/delete', {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      data: { businessId } // Use data instead of body for Axios
    });
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error deleting business:', error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message ||
      error.message ||
      'Failed to delete business';
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
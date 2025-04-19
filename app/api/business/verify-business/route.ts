// /app/api/business/verify/route.ts
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function PUT(request: Request) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Parse request body to get businessId
    let businessId;
    try {
      const body = await request.json();
      businessId = body.businessId;
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Log for debugging
    console.log('Auth header received in verify API route:', authHeader ? 'Present' : 'Missing');
    console.log('Verifying business with ID:', businessId);
    
    if (!authHeader) {
      console.warn('Authentication header missing in verify API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!businessId) {
      console.warn('Business ID missing in verify request');
      return NextResponse.json(
        { success: false, message: 'Business ID is required' },
        { status: 400 }
      );
    }
    
    // Call the admin API to verify the business
    const response = await serverFetch('/admin/business/verify', {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      data: { businessId } // Use data property for Axios
    });
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error verifying business:', error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message ||
      error.message ||
      'Failed to verify business';
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
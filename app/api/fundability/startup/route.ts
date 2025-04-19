
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function GET(request: Request) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Extract pagination parameters from URL
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '15';
    
    // Log for debugging
    console.log('Auth header received in API route:', authHeader ? 'Present' : 'Missing');
    console.log('Pagination params:', { page, limit });
    
    if (!authHeader) {
      console.warn('Authentication header missing in API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Forward request to backend with auth token and pagination params
    const businessData = await serverFetch(`/admin/fundability/startups?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    });
    
    return NextResponse.json(businessData);
  } catch (error: any) {
    console.error('Error fetching businesses:', error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message || 
      error.message || 
      'Failed to fetch businesses';
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
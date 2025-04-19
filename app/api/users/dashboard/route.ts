// /app/api/users/route.ts
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function GET(request: Request) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Log for debugging
    console.log('Auth header received in API route:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.warn('Authentication header missing in API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    // Forward request to backend with auth token - ensure exact preservation of the header
    const usersData = await serverFetch('/admin/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    });
    
    return NextResponse.json(usersData);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message || 
      error.message || 
      'Failed to fetch users';
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
// /app/api/businesss/search/route.ts
import { searchPayload } from "@/app/types/payload";
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function POST(request: Request) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Log for debugging
    console.log('Auth header received in search API route:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.warn('Authentication header missing in search API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const payload: searchPayload = await request.json();
    
    // Forward to backend with auth token
    const userData = await serverFetch('/business/lookup', {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      },
      data: payload,
    });
    
    return NextResponse.json(userData);
  } catch (error: any) {
    console.error('Search error:', error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message ||
      error.message ||
      'Failed to search businesses';
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
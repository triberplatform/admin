// /app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the id from URL params
    const userId = params.id;
    
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Log for debugging
    console.log('Auth header received in API route:', authHeader ? 'Present' : 'Missing');
    console.log('Fetching user with ID:', userId);
    
    if (!authHeader) {
      console.warn('Authentication header missing in API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Forward request to backend with auth token and user ID
    const userData = await serverFetch(`/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    });
    
    return NextResponse.json(userData);
  } catch (error: any) {
    console.error(`Error fetching user with ID ${params.id}:`, error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message ||
      error.message ||
      `Failed to fetch user with ID ${params.id}`;
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
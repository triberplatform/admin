import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

interface ScoreUpdatePayload {
  score: number;
}

export async function POST(request: Request) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Log for debugging
    console.log('Auth header received in update fundability score API route:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.warn('Authentication header missing in update fundability score API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const payload = await request.json();
    
    // Forward to backend with auth token - sending only score in the payload
    const response = await serverFetch(`/admin/fundability/${payload.fundabilityId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader
      },
      data: {
        score: payload.score
        // No reason field included in the payload
      },
    });
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Update fundability score error:', error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message ||
      error.message ||
      'Failed to update fundability score';
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
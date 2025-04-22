// src/app/api/investors/[id]/route.ts
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the investor ID from route params
    const investorId = params.id;
    
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Log for debugging
    console.log('Auth header received in investor details API route:', authHeader ? 'Present' : 'Missing');
    console.log('Fetching investor details for ID:', investorId);
    
    if (!authHeader) {
      console.warn('Authentication header missing in API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Forward request to backend with auth token
    const investorData = await serverFetch(`/investor/${investorId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    });

    return NextResponse.json(investorData);
  } catch (error: any) {
    console.error('Error fetching investor details:', error);

    // Check for different error structures
    const errorMessage =
      error.data?.message ||
      error.message ||
      'Failed to fetch investor details';

    const statusCode = error.status || 500;

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
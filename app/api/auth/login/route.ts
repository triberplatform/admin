// /app/api/auth/login/route.ts
import { signinPayLoad } from "@/app/types/payload";
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const credentials: signinPayLoad = await request.json();
    
    // Forward to backend without auth token (this is a login endpoint)
    const userData = await serverFetch('/admin/auth/login', {
      method: 'POST',
      data: credentials,
    });
    
    return NextResponse.json(userData);
  } catch (error: any) {
    console.error('Signin error:', error);
    
    // Preserve the original error structure from the backend
    if (error.data) {
      // If backend returned data property with error details
      return NextResponse.json(
        { data: error.data },
        { status: error.status || 401 }
      );
    } else {
      // Fallback to general error format
      return NextResponse.json(
        { message: error.message || 'Authentication failed' },
        { status: error.status || 401 }
      );
    }
  }
}
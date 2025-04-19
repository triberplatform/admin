// /app/api/auth/register/route.ts
import { RegisterPayload } from "@/app/types/payload";
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const credentials: RegisterPayload = await request.json();
    
    // Forward to backend using serverFetch for consistency
    const userData = await serverFetch('/admin/register/admin', {
      method: 'POST',
      data: credentials,
    });
    
    return NextResponse.json(userData);
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Preserve the original error structure from the backend
    if (error.data) {
      // If backend returned data property with error details
      return NextResponse.json(
        { data: error.data },
        { status: error.status || 400 }
      );
    } else {
      // Fallback to general error format
      return NextResponse.json(
        { message: error.message || 'Registration failed' },
        { status: error.status || 400 }
      );
    }
  }
}
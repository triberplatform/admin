// /app/api/business/edit-dealroom/[id]/route.ts
import { NextResponse } from "next/server";
import { serverFetch } from "@/app/lib/server-api";
import { EditBusinessDealRoomRPayload } from "@/app/types/payload";

// Define the business data types
interface DealRoomProfileUpdateResponse {
    success: boolean;
    message: string;
    data:EditBusinessDealRoomResponse
};

interface EditBusinessDealRoomResponse {
    id: number;
    publicId: string;
    businessId: string;
    topSellingProducts: string[];
    highlightsOfBusiness: string;
    facilityDetails: string;
    fundingDetails: string;
    averageMonthlySales: string;
    reportedYearlySales: string;
    profitMarginPercentage: number;
    assetsDetails: string[];
    valueOfPhysicalAssets: string;
    tentativeSellingPrice: string;
    reasonForSale: string;
    businessPhotos: string[];
    proofOfBusiness: string;
    businessDocuments: string[];
    createdAt: string;
    updatedAt: string;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // Get business ID from URL params
    const businessId = params.id;
    
    // Parse request body to get business data
    let businessData: EditBusinessDealRoomRPayload;
    try {
      businessData = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }


    // Log for debugging
    console.log('Auth header received in edit business API route:', authHeader ? 'Present' : 'Missing');
    console.log('Editing DealRoom with ID:', businessId);
    console.log('Business data to update:', businessData);
    
    if (!authHeader) {
      console.warn('Authentication header missing in edit business API route request');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!businessId) {
      console.warn('Business ID missing in edit business request');
      return NextResponse.json(
        { success: false, message: 'Business ID is required' },
        { status: 400 }
      );
    }
    
    // Call the admin API to edit the business
    const response = await serverFetch<DealRoomProfileUpdateResponse>(`/admin/dealroom/business/${businessId}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      data: businessData
    });
    

    // Log the response for debugging
    console.log("Edit business API response:", response);
    
    // Return the response with the exact format
    return NextResponse.json({
      success: response.success,
      message: response.message || "Business details updated successfully",
      data: response.data
    });
  } catch (error: any) {
    console.error('Error editing business:', error);
    
    // Check for different error structures
    const errorMessage = 
      error.data?.message ||
      error.message ||
      'Failed to edit business';
    
    const statusCode = error.status || 500;
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
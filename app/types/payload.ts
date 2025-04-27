export interface signinPayLoad{
    email:string;
    password:string;
}

export interface RegisterPayload {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword?:string
}
export interface suspendPayload {
    publicId:string
}


export interface searchPayload {
    query: string;
  }


  export interface EditBusinessDealRoomRPayload {
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
}
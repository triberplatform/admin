export interface SigninResponse {
    token: string;
    message: string;
    user: User;
}

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    companyname: string;
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
}

export interface RegisterResponse {
    message: string,
    data: string,
    success: boolean
}

export interface UserData {
    id: string;
    publicId: string;
    firstname: string;
    lastname: string;
    isAdmin: boolean;
    isSuspended: boolean;
    email: string;
    companyname: string;
    password: string;
    otp: {
        code: string;
        createdAt: number;
    };
    createdAt: string;
    updatedAt: string;
    emailVerified: boolean;
}


export interface UserAPIResponse {
    message: string,
    data: userObj,
    success: boolean
}

export interface userObj{
  users:UserData[];
  metadata:Pagination
  
}

export interface Pagination {
  
    total: number,
    page: number,
    limit: number,
    totalPages: number

}
export interface UserAPIResponseDetails {
    message: string,
    data: UserDetails,
    success: boolean
}
export interface UserDetails {
    publicId: string;
    firstname: string;
    lastname: string;
    email: string;
    companyname: string;
    emailVerified: boolean;
    isAdmin: boolean;
    isSuspended: boolean;
    createdAt: string;
    updatedAt: string;
    businesses: Business[];
    investorProfile: InvestorProfile | null;
  }
  
  export interface Business {
    id: number;
    publicId: string;
    businessName: string;
    businessEmail: string;
    businessPhone: string;
    businessLogoUrl: string;
    businessStatus: 'REGISTERED' | 'UNREGISTERED';
    interestedIn: 'PARTIAL_STAKE' | 'FULL_SALE_OF_BUSINESS' | 'LOAN';
    industry: 'FINANCE' | 'HEALTH' | 'SPORTS' | 'WASTE_MANAGEMENT' | 'OTHER';
    numOfEmployees: 'LESS_THAN_10' | 'BETWEEN_10_AND_50' | 'BETWEEN_50_AND_100';
    yearEstablished: number;
    location: string;
    description: string;
    assets: string;
    reportedSales: string;
    businessLegalEntity: 'LIMITED_LIABILITY_COMPANY' | 'PRIVATE_LIABILITY_COMPANY' | 'SOLE_PROPRIETORSHIP';
    createdAt: string;
    updatedAt: string;
    businessStage: 'Startup' | 'SME';
    dealRoomDetails: DealRoomDetails | null;
    fundabilityTestDetails: FundabilityTestDetails | null;
    assignedAt: string;
  }
  
  export interface DealRoomDetails {
    id: number;
    publicId: string;
    businessId: string;
    topSellingProducts: string[];
    highlightsOfBusiness: string;
    facilityDetails: string;
    fundingDetails: string;
    averageMonthlySales: number;
    reportedYearlySales: number;
    profitMarginPercentage: number;
    assetsDetails: string[];
    valueOfPhysicalAssets: number;
    tentativeSellingPrice: number;
    reasonForSale: string;
    businessPhotos: string[];
    proofOfBusiness: string;
    businessDocuments: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface FundabilityTestDetails {
    publicId: string;
    score: number;
  }
  
  export interface InvestorProfile {
    id: number;
    email: string;
    companyName: string;
    companyLogoUrl: string;
    publicId: string;
    about: string;
    location: string;
    createdAt: string;
    updatedAt: string;
  }
  


  // Main API Response
export interface ApiResponse {
  success: boolean;
  message: string;
  data: BusinessData ;
}

export interface ApiResponseAll {
  success: boolean;
  message: string;
  data: businessObj;
}

export interface businessObj{
  businesses:BusinessData[];
  metadata: Pagination
}


// Business Data
export interface BusinessData {
  id: number;
  publicId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessLogoUrl: string;
  businessStatus: BusinessStatus;
  interestedIn: InterestedIn;
  industry: Industry;
  numOfEmployees: EmployeeRange;
  yearEstablished: number;
  location: string;
  description: string;
  assets: string;
  reportedSales: string;
  businessStage: BusinessStage;
  businessLegalEntity: BusinessLegalEntity;
  createdAt: string;
  updatedAt: string;
  businessVerificationStatus: boolean;
  startupTestDetails:StartupTestDetails;
  fundabilityTestDetails: FundabilityTestDetail;
  dealRoomDetails: DealRoomDetail;
}

export interface StartupTestDocs {
  pitchDeck: string | null;
  businessPlan: string | null;
  statusReport: string | null;
  relevantLicenses: string | null;
  financialStatements: string | null;
  letterOfGoodStanding: string | null;
  memorandumOfAssociation: string | null;
  companyLiabilitySchedule: string | null;
  certificateOfIncorporation: string | null;
}

export interface StartupTestDetails {
  id: number;
  userId: number;
  publicId: string;
  score: number;
  businessId: string;
  registeredCompany: boolean;
  legalName: string;
  companyRegistration: string;
  city: string;
  country: string;
  industry: string;
  registeredAddress: string;
  companyEmail: string;
  contactNumber: string;
  principalAddress: string;
  applicantsAddress: string;
  position: string;
  title: string;
  yearsOfOperation: number;
  companySize: number;
  companyLegalCases: boolean;
  startupStage: string;
  ownership: string[];
  executiveManagement: string[];
  boardOfDirectors: string[];
  isicIndustry: boolean;
  isicActivity: string;
  legalAdvisors: string[];
  totalAddressableMarket: number;
  licensesToOperate: boolean;
  companyPitchDeck: boolean;
  companyBusinessPlan: boolean;
  company5yearCashFlow: boolean;
  companySolidAssetHolding: boolean;
  companyLargeInventory: boolean;
  company3YearProfitable: boolean;
  companyHighScalibilty: boolean;
  companyCurrentLiabilities: boolean;
  ownerCurrentLiabilities: boolean;
  customerLifetimeValue: number;
  customerAcquisitionCost: number;
  expectedAnnualGrowthRate: number;
  docs: StartupTestDocs;
  createdAt: string;
  updatedAt: string;
}

// Enum Types
export enum BusinessStatus {
  REGISTERED = "REGISTERED",
  PENDING = "PENDING",
  DECLINED = "DECLINED"
}

export enum InterestedIn {
  PARTIAL_STAKE = "PARTIAL_STAKE",
  FULL_ACQUISITION = "FULL_ACQUISITION"
}

export enum Industry {
  FINANCE = "FINANCE",
  TECHNOLOGY = "TECHNOLOGY",
  HEALTHCARE = "HEALTHCARE",
  RETAIL = "RETAIL",
  // Add other industries as needed
}

export enum EmployeeRange {
  LESS_THAN_10 = "LESS_THAN_10",
  BETWEEN_10_AND_50 = "BETWEEN_10_AND_50",
  BETWEEN_50_AND_200 = "BETWEEN_50_AND_200",
  MORE_THAN_200 = "MORE_THAN_200"
}

export enum BusinessStage {
  PRE_REVENUE = "PRE_REVENUE",
  STARTUP = "STARTUP",
  SME = "SME",
  ENTERPRISE = "ENTERPRISE"
}

enum BusinessLegalEntity {
  SOLE_PROPRIETORSHIP = "SOLE_PROPRIETORSHIP",
  PARTNERSHIP = "PARTNERSHIP",
  LIMITED_LIABILITY_COMPANY = "LIMITED_LIABILITY_COMPANY",
  CORPORATION = "CORPORATION"
}

// Fundability Test Details
export interface FundabilityTestDetail {
  id: number;
  userId: number;
  publicId: string;
  score: number;
  businessId: string;
  registeredCompany: boolean;
  legalName: string;
  companyRegistration: string;
  city: string;
  country: string;
  industry: string;
  registeredAddress: string;
  companyEmail: string;
  contactNumber: string;
  principalAddress: string;
  applicantsAddress: string;
  position: string;
  title: string;
  yearsOfOperation: number;
  companySize: number;
  companyLegalCases: boolean;
  startupStage: string;
  ownership: string[];
  executiveManagement: string[];
  boardOfDirectors: string[];
  isicIndustry: boolean;
  isicActivity: string;
  legalAdvisors: string[];
  averageAnnualRevenue: number;
  revenueGrowthRate: number;
  auditedFinancialStatement: boolean;
  companyPitchDeck: boolean;
  companyBusinessPlan: boolean;
  company5yearCashFlow: boolean;
  companySolidAssetHolding: boolean;
  companyLargeInventory: boolean;
  company3YearProfitable: boolean;
  companyHighScalibilty: boolean;
  companyCurrentLiabilities: boolean;
  ownerCurrentLiabilities: boolean;
  docs: FundabilityDocs;
  createdAt: string;
  updatedAt: string;
}

export interface FundabilityDocs {
  pitchDeck: string | null;
  businessPlan: string | null;
  statusReport: string | null;
  relevantLicenses: string | null;
  financialStatements: string | null;
  letterOfGoodStanding: string | null;
  memorandumOfAssociation: string | null;
  companyLiabilitySchedule: string | null;
  certificateOfIncorporation: string | null;
}

// Deal Room Details
export interface DealRoomDetail {
  id: number;
  publicId: string;
  businessId: string;
  topSellingProducts: string[];
  highlightsOfBusiness: string;
  facilityDetails: string;
  fundingDetails: string;
  averageMonthlySales: number;
  reportedYearlySales: number;
  profitMarginPercentage: number;
  assetsDetails: string[];
  valueOfPhysicalAssets: number;
  tentativeSellingPrice: number;
  reasonForSale: string;
  businessPhotos: string[];
  proofOfBusiness: string;
  businessDocuments: string[];
  createdAt: string;
  updatedAt: string;
  proposalDetails: any[]; // This could be further defined if you have the structure
}

export interface dashboardData{
  
    success: boolean,
    message: string,
    data: dashboardDataDetails
}

export interface dashboardDataDetails{
  investorsCount: number,
  businessesCount: number,
  usersCount: number
}

export interface SuspendUserResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    publicId: string;
    firstname: string;
    lastname: string;
    isAdmin: boolean;
    isSuspended: boolean;
    email: string;
    companyname: string;
    password: string;
    otp: {
      code: string;
      createdAt: number;
    };
    createdAt: string;
    updatedAt: string;
    emailVerified: boolean;
  };
}

export interface FundabilityTestResponse {
  success: boolean;
  message: string;
  data: {
    fundabilityTests: FundabilityTestSME[];
    metadata: Pagination
  };
}

// Main interface for the fundability test SME data
export interface FundabilityTestSME {
  id: number;
  userId: number;
  publicId: string;
  score: number;
  businessId: string;
  registeredCompany: boolean;
  legalName: string;
  companyRegistration: string;
  city: string;
  country: string;
  industry: string;
  registeredAddress: string;
  companyEmail: string;
  contactNumber: string;
  principalAddress: string;
  applicantsAddress: string;
  position: string;
  title: string;
  yearsOfOperation: number;
  companySize: number;
  companyLegalCases: boolean;
  startupStage: string;
  ownership: string[];
  executiveManagement: string[];
  boardOfDirectors: string[];
  isicIndustry: boolean;
  isicActivity: string;
  legalAdvisors: string[];
  averageAnnualRevenue: number;
  revenueGrowthRate: number;
  auditedFinancialStatement: boolean;
  companyPitchDeck: boolean;
  companyBusinessPlan: boolean;
  company5yearCashFlow: boolean;
  companySolidAssetHolding: boolean;
  companyLargeInventory: boolean;
  company3YearProfitable: boolean;
  companyHighScalibilty: boolean;
  companyCurrentLiabilities: boolean;
  ownerCurrentLiabilities: boolean;
  docs: {
    pitchDeck: string | null;
    businessPlan: string | null;
    statusReport: string | null;
    relevantLicenses: string | null;
    financialStatements: string | null;
    letterOfGoodStanding: string | null;
    memorandumOfAssociation: string | null;
    companyLiabilitySchedule: string | null;
    certificateOfIncorporation: string | null;
  };
  createdAt: string;
  updatedAt: string;
  business: Business;
}

// Interface for the business data
// interface Business {
//   id: number;
//   publicId: string;
//   businessName: string;
//   businessEmail: string;
//   businessPhone: string;
//   businessLogoUrl: string;
//   businessStatus: string;
//   interestedIn: string;
//   industry: string;
//   numOfEmployees: string;
//   yearEstablished: number;
//   location: string;
//   description: string;
//   assets: string;
//   reportedSales: string;
//   businessStage: string;
//   businessLegalEntity: string;
//   createdAt: string;
//   updatedAt: string;
//   businessVerificationStatus: boolean;
// }

export interface FundabilityTestResponseStartUp {
  success: boolean;
  message: string;
  data: {
    fundabilityTests: FundabilityTestStartup[];
    metadata: Pagination
  };
}

// Main interface for the fundability test Startup data
export interface FundabilityTestStartup {
  id: number;
  userId: number;
  publicId: string;
  score: number;
  businessId: string;
  registeredCompany: boolean;
  legalName: string;
  companyRegistration: string;
  city: string;
  country: string;
  industry: string;
  registeredAddress: string;
  companyEmail: string;
  contactNumber: string;
  principalAddress: string;
  applicantsAddress: string;
  position: string;
  title: string;
  yearsOfOperation: number;
  companySize: number;
  companyLegalCases: boolean;
  startupStage: string;
  ownership: string[];
  executiveManagement: string[];
  boardOfDirectors: string[];
  isicIndustry: boolean;
  isicActivity: string;
  legalAdvisors: string[];
  totalAddressableMarket: number;
  licensesToOperate: boolean;
  companyPitchDeck: boolean;
  companyBusinessPlan: boolean;
  company5yearCashFlow: boolean;
  companySolidAssetHolding: boolean;
  companyLargeInventory: boolean;
  company3YearProfitable: boolean;
  companyHighScalibilty: boolean;
  companyCurrentLiabilities: boolean;
  ownerCurrentLiabilities: boolean;
  customerLifetimeValue: number;
  customerAcquisitionCost: number;
  expectedAnnualGrowthRate: number;
  docs: {
    pitchDeck: string | null;
    businessPlan: string | null;
    statusReport: string | null;
    relevantLicenses: string | null;
    financialStatements: string | null;
    letterOfGoodStanding: string | null;
    memorandumOfAssociation: string | null;
    companyLiabilitySchedule: string | null;
    certificateOfIncorporation: string | null;
  };
  createdAt: string;
  updatedAt: string;
 
}


export interface Investor {
  id: number;
  publicId: string;
  userId: number;
  email: string;
  phoneNumber: string | null;
  companyName: string;
  about: string;
  companyLogoUrl: string;
  companyWebsiteUrl: string;
  termsOfAgreementDocUrl: string;
  proofOfBusinessDocUrl: string;
  location: string;
  interestedLocations: string; // JSON string of locations
  designation: string;
  numOfExpectedDeals:string;
  companyType: string;
  interestedFactors: string; // JSON string of factors
  fundsUnderManagement: number;
  createdAt: string;
  updatedAt: string;
}

// API response interface
export interface InvestorApiResponse {
  success: boolean;
  message: string;
  data: Investor[];
}
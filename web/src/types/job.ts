export type RadiusOption = 15 | 30 | 60 | 150 | 0; // 0 represents 'Nationwide / 전체'

export type JobCategory = 'ALL' | 'F_AND_B' | 'LODGING_CLEANING' | 'LOGISTICS' | 'TECH';

export interface JobPost {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  category: JobCategory;
  categoryName: string;
  locationName: string; // 업체 주소
  latitude: number;
  longitude: number;
  distanceKm?: number;
  salary: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  matchScore: number; // e.g. 96%
  skills: string[];
  postedAt: string;
  deadline: string;
  description: string;
  isEasyApply: boolean;
  commuteTimeEstimate?: {
    transitMinutes: number;
    carMinutes: number;
  };
}

export interface UserLocation {
  address: string;
  latitude: number;
  longitude: number;
  countryCode: string; // e.g. 'US', 'AU', 'JP', 'CA', 'MX', 'CN', 'DE'
  countryName: string; // e.g. '미국 (United States)'
  isGranted: boolean;
}

export interface CountryNews {
  title: string;
  source: string;
  timeAgo: string;
  summary: string;
  url?: string;
}

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
  imageUrl?: string; // 공고 이미지 첨부 URL
  isPaid?: boolean; // $1.00 USD 결제 여부
  isPremiumAd?: boolean; // $30.00 USD 상단 5초 로테이션 광고 여부
  adPrice?: number; // e.g. 1.00 or 30.00
  paidAt?: string; // 결제 시각
  expiresAt?: string; // 결제 성공 시각부터 정확히 7일 후 만료 시각
  originalJobId?: string; // 기존 공고 재활용/복사 시 원본 공고 ID
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

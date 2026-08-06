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
  commuteTimeEstimate?: {
    transitMinutes: number;
    carMinutes: number;
  };
  // Daangn Jobs Work Specifications (언제 어떻게 일하는지 고용내용)
  workDays?: string; // e.g. "월~금 (주 5일)"
  workHours?: string; // e.g. "09:00 ~ 18:00 (휴게시간 1시간)"
  workPeriod?: string; // e.g. "3개월 이상 / 장기 우대"
  benefits?: string[]; // e.g. ["식사 제공", "주휴수당", "유니폼 지원", "초보 가능"]
  // Daangn Jobs Employer Rating & 5-Badge System
  daangnScore?: number; // e.g. 4.8 / 5.0
  daangnBadges?: string[]; // e.g. ["급여를 제때 줘요", "사장님이 친절해요", "근무 환경이 쾌적해요"]
  reviewCount?: number;
}

export interface DaangnReview {
  id: string;
  jobId: string;
  companyName: string;
  reviewerName: string;
  rating: number; // 1.0 ~ 5.0
  selectedBadges: string[];
  comment: string;
  createdTime: string;
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

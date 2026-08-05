export type RadiusOption = 15 | 30 | 60 | 150 | 0; // 0 represents 'Nationwide / 전체'

export interface JobPost {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  salary: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Visa Sponsored';
  visaTypes: string[]; // e.g. ['E-7', 'F-4', 'H-1', 'F-6']
  matchScore: number; // e.g. 94%
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
}

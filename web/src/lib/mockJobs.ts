import { JobPost, UserLocation } from '@/types/job';

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const INITIAL_USER_LOCATION: UserLocation = {
  address: '서울특별시 광진구 화양동 (건대입구)',
  latitude: 37.5404,
  longitude: 127.0694,
};

export const MOCK_JOBS: Omit<JobPost, 'distanceKm'>[] = [
  {
    id: 'job-1',
    title: '글로벌 풀스택 백엔드 개발자 (NestJS & Supabase)',
    companyName: 'K-Tech Global Systems',
    companyLogo: '🚀',
    locationName: '서울 성수동 (성수역 3번출구)',
    latitude: 37.5446,
    longitude: 127.0559,
    salary: '연봉 5,500 ~ 7,500만 원',
    employmentType: 'Full-time',
    visaTypes: ['E-7-1', 'F-4', 'F-6'],
    matchScore: 96,
    skills: ['NestJS', 'PostgreSQL', 'TypeScript', 'Docker'],
    postedAt: '1시간 전',
    deadline: '2026-08-31',
    description: '해외 이민자 커뮤니티용 초고속 매칭 플랫폼 백엔드 개발을 담당할 엔지니어를 모집합니다. 비자 지원 가능.',
    isEasyApply: true,
    commuteTimeEstimate: { transitMinutes: 12, carMinutes: 10 },
  },
  {
    id: 'job-2',
    title: 'UI/UX 디자이너 & 프로덕트 오너',
    companyName: 'NextFlow Lab',
    companyLogo: '🎨',
    locationName: '서울 잠실 (잠실역 8번출구)',
    latitude: 37.5133,
    longitude: 127.1001,
    salary: '연봉 4,800 ~ 6,200만 원',
    employmentType: 'Full-time',
    visaTypes: ['E-7', 'F-2', 'F-5'],
    matchScore: 91,
    skills: ['Figma', 'Design System', 'User Research', 'React'],
    postedAt: '3시간 전',
    deadline: '2026-08-25',
    description: '글로벌 유저 타겟 글로벌 디자인 시스템 설계 및 모바일 웹 앱 UX 최적화.',
    isEasyApply: true,
    commuteTimeEstimate: { transitMinutes: 20, carMinutes: 18 },
  },
  {
    id: 'job-3',
    title: 'AI 데이터 파이프라인 & LLM 엔지니어',
    companyName: 'PanGeo AI Solutions',
    companyLogo: '🤖',
    locationName: '경기 판교 테크노밸리',
    latitude: 37.402,
    longitude: 127.1086,
    salary: '연봉 6,500 ~ 9,000만 원',
    employmentType: 'Full-time',
    visaTypes: ['E-7', 'F-4'],
    matchScore: 88,
    skills: ['Python', 'Gemini API', 'pgvector', 'RAG'],
    postedAt: '오늘',
    deadline: '2026-09-10',
    description: 'pgvector 및 LLM 모델을 활용한 이력서 자동 파싱 및 실시간 공고 추천 알고리즘 설계.',
    isEasyApply: true,
    commuteTimeEstimate: { transitMinutes: 45, carMinutes: 35 },
  },
  {
    id: 'job-4',
    title: '스마트 물류 시스템 현장 매니저',
    companyName: 'LogiKorea Corp',
    companyLogo: '📦',
    locationName: '경기 수원 영통구',
    latitude: 37.2596,
    longitude: 127.0464,
    salary: '월급 350만 원',
    employmentType: 'Full-time',
    visaTypes: ['H-1', 'E-9', 'F-4', 'F-6'],
    matchScore: 82,
    skills: ['Logistics', 'Inventory', 'Bilingual'],
    postedAt: '2일 전',
    deadline: '2026-08-20',
    description: '다국어 소통 능력을 갖춘 물류 매니지먼트 팀원 모집.',
    isEasyApply: false,
    commuteTimeEstimate: { transitMinutes: 65, carMinutes: 45 },
  },
  {
    id: 'job-5',
    title: '글로벌 마케팅 & 커뮤니티 리드',
    companyName: 'K-Bridge Talent',
    companyLogo: '🌐',
    locationName: '강원 원주시 단계동',
    latitude: 37.3514,
    longitude: 127.9254,
    salary: '연봉 4,000 ~ 5,000만 원',
    employmentType: 'Contract',
    visaTypes: ['H-1', 'D-10', 'F-4'],
    matchScore: 78,
    skills: ['SNS Marketing', 'English', 'Community'],
    postedAt: '3일 전',
    deadline: '2026-09-01',
    description: '해외 이민자 네트워크 확장 및 커뮤니티 이벤트 기획.',
    isEasyApply: true,
    commuteTimeEstimate: { transitMinutes: 110, carMinutes: 85 },
  },
];

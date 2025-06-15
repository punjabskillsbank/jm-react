export interface JobPosting {
  jobPostingId: number;
  clientId: string;
  title: string;
  description: string;
  budgetType: 'HOURLY' | 'FIXED';
  hourlyMinRate: number | null;
  hourlyMaxRate: number | null;
  fixedPrice: number | null;
  projectDuration: string;
  experienceLevel: string;
  jobPostingStatus: string;
  category: {
    categoryId: number;
    category: string;
    speciality: string;
    createdAt: string;
    updatedAt: string;
  };
  skills: string[];
  createdAt: string | null;
  updatedAt: string | null;
  
}
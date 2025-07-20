export type BudgetType = 'HOURLY' | 'FIXED';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';
export type JobPostingStatus = 'DRAFT' | 'IN_REVIEW' | 'POSTED' | 'CLOSED' | string;

export interface Category {
  categoryId: number;
  category: string;
  speciality: string | string[]; // Depending on backend response
  createdAt: string;
  updatedAt: string;
}

export interface JobPosting {
  jobPostingId: number;
  clientId: string;
  title: string;
  description: string;
  budgetType: BudgetType;
  hourlyMinRate: number | null;
  hourlyMaxRate: number | null;
  fixedPrice: number | null;
  projectDuration: string;
  experienceLevel: ExperienceLevel;
  jobPostingStatus: JobPostingStatus;
  category: Category;
  skills: string[];
  createdAt: string | null;
  updatedAt: string | null;
}
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
  budgetType: 'HOURLY' | 'FIXED';
  hourlyMinRate: number;
  hourlyMaxRate: number;
  fixedPrice: number;
  projectDuration: string;
  experienceLevel: string;
  jobPostingStatus: string;
  category: {
    categoryId: number;
    category: string;
    speciality: string;
  };
  skills: string[];
  questions: {
    questionId: number;
    question: string;
  }[];
}

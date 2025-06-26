import axios from "axios";
import config from "../config/indexConfig";

export interface Certificate {
  certificateName: string;
  issuedBy: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  freelancerId?: string;
}

export interface Education {
  institute: string;
  degree: string;
  start_year: string;
  end_year?: string;
  description?: string;
  freelancerId?: string;
}

export interface JobExperience {
  title: string;
  description: string;
  budget_type: string;
  fixed_price?: number;
  hourly_min_rate?: number;
  hourly_max_rate?: number;
  project_duration?: string;
  experience_level?: string;
}

export interface CategoryDTO {
  categoryId: number; // @NotNull(message = "CategoryId cannot be null")
  category?: string;
  speciality?: string;
}

export interface ProfilePayload {
  freelancerId: string;
  name: string;
  title: string;
  bio: string;
  hourlyRate: number;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  address: string;
  phoneNumber: string;
  isAbcMember: boolean;
  certificates: Certificate[];
  education: Education[];
  jobs: JobExperience[];
  profilePhotoS3Key: string | null;
  profileStatus: string;
  timezone: string;
  profileVisibility: string;
  categoriesDTO: CategoryDTO[];
}

export class ProfileService {
  static async getPresignedUrl(userId: string, contentType: string) {
    const url = config.baseURLs.users + config.endpoints.presignedUpload;
    const { data } = await axios.get(url, {
      params: { userId, contentType },
    });
    return data;
  }

  static async uploadPhotoToS3(presignedUrl: string, file: File, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await axios.put(presignedUrl, file, {
          headers: { "Content-Type": file.type },
        });
        return true;
      } catch (error) {
        if (attempt === retries) throw error;
      }
    }
    return false;
  }

  static async createFreelancerProfile(payload: ProfilePayload) {
    const url = config.baseURLs.users + config.endpoints.createFreelancerProfile;
    return axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });
  }
}

import axios from "axios";
import { ProfileService, ProfilePayload } from "./ProfileService";

// Mock axios properly
jest.mock("axios");
const mockedAxios = axios as jest.MockedFunction<typeof axios> & {
  get: jest.MockedFunction<typeof axios.get>;
  post: jest.MockedFunction<typeof axios.post>;
  put: jest.MockedFunction<typeof axios.put>;
};

describe("ProfileService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPresignedUrl", () => {
    it("should call axios.get with correct params and return data", async () => {
      const mockData = { uploadUrl: "url", s3Key: "key" };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      
      const result = await ProfileService.getPresignedUrl("user123", "image/png");
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:8081/api/presigned_url/upload",
        { params: { userId: "user123", contentType: "image/png" } }
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("uploadPhotoToS3", () => {
    it("should call axios.put with correct params and resolve true", async () => {
      const file = new File(["dummy content"], "photo.png", { type: "image/png" });
      mockedAxios.put.mockResolvedValueOnce({});
      
      const result = await ProfileService.uploadPhotoToS3("presigned-url", file);
      
      expect(mockedAxios.put).toHaveBeenCalledWith(
        "presigned-url",
        file,
        { headers: { "Content-Type": "image/png" } }
      );
      expect(result).toBe(true);
    });

    it("should retry and throw error after max retries", async () => {
      const file = new File(["dummy content"], "photo.png", { type: "image/png" });
      mockedAxios.put.mockRejectedValue(new Error("fail"));
      
      await expect(ProfileService.uploadPhotoToS3("presigned-url", file, 2)).rejects.toThrow("fail");
      expect(mockedAxios.put).toHaveBeenCalledTimes(2);
    });
  });

  describe("createFreelancerProfile", () => {
    it("should call axios.post with correct url, payload, and headers", async () => {
      const payload: ProfilePayload = {
        freelancerId: "user123",
        name: "Test User",
        title: "Title",
        bio: "Bio",
        hourlyRate: 10,
        city: "City",
        state: "State",
        country: "Country",
        postalCode: "12345",
        address: "Address",
        phoneNumber: "1234567890",
        isAbcMember: false,
        certificates: [],
        education: [],
        jobs: [],
        profilePhotoS3Key: null,
        profileStatus: "PENDING",
        timezone: "Asia/Kolkata",
      };
      
      mockedAxios.post.mockResolvedValueOnce({ data: { message: "ok" } });
      
      const result = await ProfileService.createFreelancerProfile(payload);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8081/api/freelancer/create_profile",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      expect(result.data).toEqual({ message: "ok" });
    });
  });
});
// src/config/common.ts

const common = {
  ports: {
    jobPosting: 8081,
    users: 8081,
  },
  featureFlags: {
    enableNewUI: false,
    loggingEnabled: true,
  },
  endpoints: {
    presignedUpload: '/api/presigned_url/upload',
    createFreelancerProfile: '/api/freelancer/create_profile',
    // ...other endpoints...
  },
};

export default common;

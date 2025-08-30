
const common = {
  ports: {
    jobPosting: 8080,
    users: 8081,
  },
  featureFlags: {
    enableNewUI: false,
    loggingEnabled: true,
  },
  endpoints: {
    presignedUpload: '/api/presigned_url/upload',
    createFreelancerProfile: '/api/freelancer/create_profile',
    pendingFreelancers: "api/admin_management/pending_freelancers",
    // ...other endpoints...
  },
};

export default common;

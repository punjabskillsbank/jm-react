import common from "../config/commonConfig";
import local from "../config/localConfig";

export const getPendingFreelancers = async () => {
  const url = `${local.baseURLs.adminManagement}${common.endpoints.pendingFreelancers}`;
  console.log(" Fetching:", url); // Debug log

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch pending freelancers: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(" Error in getPendingFreelancers:", error);
    throw error;
  }
};

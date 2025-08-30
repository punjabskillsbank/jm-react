import local from "../config/localConfig";
import common from "../config/commonConfig";

export const getPendingFreelancers = async () => {
  try {
    const response = await fetch(
      `${local.baseURLs.adminManagement}${common.endpoints.pendingFreelancers}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch pending freelancers");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching pending freelancers:", error);
    throw error;
  }
};

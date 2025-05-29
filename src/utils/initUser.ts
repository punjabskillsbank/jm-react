import { mockUsers } from "./mockUsers";

export const initMockUser = () => {
  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  localStorage.setItem("user_id", randomUser.id);
  localStorage.setItem("user_name", randomUser.name);
  localStorage.setItem("user_email", randomUser.email);
};

export const getMockUserId = (name?: string): string | null => {
  if (name) {
    const user = mockUsers.find((user) => user.name === name);
    return user ? user.id : null;
  }
  return localStorage.getItem("user_id");
};
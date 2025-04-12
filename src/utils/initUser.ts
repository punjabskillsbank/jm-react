// src/utils/initUser.ts
import { mockUsers } from "../mockUsers";

export const initMockUser = () => {
  if (!localStorage.getItem("user_id")) {
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    localStorage.setItem("user_id", randomUser.id);
    localStorage.setItem("user_name", randomUser.name);
    localStorage.setItem("user_email", randomUser.email);
  }
};

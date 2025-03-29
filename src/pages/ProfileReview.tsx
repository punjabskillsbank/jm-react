import { useSignup } from "../context/SignupContext";

const ProfileReview = () => {
  const { signupData } = useSignup();

  return (
    <div>
      <h1>Profile Review</h1>
      <p>Name: {signupData.name || "Not provided"}</p>
      <p>Email: {signupData.email || "Not provided"}</p>
      <p>Password: {signupData.password ? "Entered" : "Not provided"}</p>
    </div>
  );
};

export default ProfileReview;

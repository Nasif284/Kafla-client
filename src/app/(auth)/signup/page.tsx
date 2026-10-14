import SignUpPage from "@/src/features/user/auth/pages/SignUpPage";
import { Suspense } from "react";

const SignUp = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpPage />
    </Suspense>
  );
};

export default SignUp;

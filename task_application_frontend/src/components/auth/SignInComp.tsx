import { SignIn } from "@clerk/clerk-react";

export default function SignInComp() {
  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <SignIn
        path="sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
      />
    </div>
  );
}

import { SignUp, useSignUp } from "@clerk/clerk-react";

export default function SignUpComp() {
  const { isLoaded } = useSignUp();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <SignUp
        path="sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/"
        appearance={{
          layout: {
            helpPageUrl: "https://clerk.dev/support",
            logoImageUrl: "/yuz3.JPEG",
            logoPlacement: "inside",
            socialButtonsPlacement: "bottom",
            socialButtonsVariant: "iconButton",
            privacyPageUrl: "https://clerk.dev/privacy",
            termsPageUrl: "https://clerk.dev/terms",
          },
        }}
      />
    </div>
  );
}

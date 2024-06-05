"use client";

import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="grid h-screen w-full grow items-center px-4 sm:justify-center">
      <SignIn signUpUrl="/sign-up" />
    </div>
  );
}

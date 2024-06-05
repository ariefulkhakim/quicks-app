"use client";

import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex w-full items-center px-4 sm:justify-center h-screen">
      <SignUp signInUrl="/sign-in" />
    </div>
  );
}

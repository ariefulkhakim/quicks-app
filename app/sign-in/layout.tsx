"use client";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const SignInLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default SignInLayout;

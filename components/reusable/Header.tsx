"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { Card } from "../ui/card";

type Props = {};

const Header = (props: Props) => {
  const pathname = usePathname();
  return (
    <Card className="p-3 mb-4">
      <p className="capitalize text-2xl font-semibold">
        {pathname.replace("/", "")}
      </p>
    </Card>
  );
};

export default Header;

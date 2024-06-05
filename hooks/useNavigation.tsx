"use client";
import { HomeIcon, UserRoundCheck, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();

  const paths = useMemo(
    () => [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: <HomeIcon />,
        active: pathname === "/dashboard",
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <UserRoundCheck />,
        active: pathname === "/friends",
      },
      {
        name: "Users",
        href: "/users",
        icon: <Users />,
        active: pathname === "/users",
      },
    ],
    [pathname]
  );

  return paths;
};

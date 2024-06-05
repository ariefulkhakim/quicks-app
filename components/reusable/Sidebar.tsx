"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React from "react";
import { Card } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { NotebookIcon } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { ModeToggle } from "./ButtonMode";

type Props = {};

const Sidebar = (props: Props) => {
  const paths = useNavigation();
  const { user } = useUser();
  return (
    <Card className="w-0 lg:w-1/5 h-full flex lg:flex-col lg:justify-between p-5">
      <nav>
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-1 items-center">
            <NotebookIcon />
            <h2 className="font-bold text-2xl">Quicks</h2>
          </div>
          <ModeToggle />
        </div>
        <ul>
          {paths.map((path, id) => (
            <li key={id} className="mb-3">
              <Link href={path.href}>
                <Button
                  className="flex space-x-4 w-full justify-start"
                  variant={path.active ? "default" : "ghost"}
                >
                  {path.icon} <p>{path.name}</p>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center space-x-2">
        <UserButton afterSignOutUrl="/sign-in" />
        <p className="capitalize font-medium">{user?.username}</p>
      </div>
    </Card>
  );
};

export default Sidebar;

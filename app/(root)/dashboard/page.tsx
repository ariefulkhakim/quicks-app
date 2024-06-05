"use client";
import { useUser } from "@clerk/clerk-react";
import React from "react";

type Props = {};

const DashboardPage = (props: Props) => {
  const { user } = useUser();
  return (
    <>
      <div className="py-5 pt-0 flex flex-col space-y-2">
        <h2 className="capitalize font-bold text-3xl">
          Hello, {user?.username}
        </h2>
        <p>
          Welcome to quicks, web aplication for managment task and communication
          for team.
        </p>
      </div>
    </>
  );
};

export default DashboardPage;

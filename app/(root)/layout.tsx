"use client";
import Header from "@/components/reusable/Header";
import Sidebar from "@/components/reusable/Sidebar";
import FloatingButton from "@/components/reusable/FloatingButton";
import { Card } from "@/components/ui/card";

type Props = React.PropsWithChildren<{}>;

const RootLayout = ({ children }: Props) => {
  return (
    <div className="flex w-full p-5 space-x-5 h-screen">
      <Sidebar />
      <Card className="w-full p-5">
        {/* <Header /> */}
        {children}
      </Card>
      <FloatingButton />
    </div>
  );
};

export default RootLayout;

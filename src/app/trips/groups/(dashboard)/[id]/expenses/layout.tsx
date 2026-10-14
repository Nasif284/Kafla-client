import Tabs from "@/src/features/user/trips/features/expense/components/Tabs";
import React from "react";
const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-[#f7faf6] border border-[#bec9c3]/15 rounded-3xl p-6 flex flex-col">
      <div className="flex items-center mb-6">
        <Tabs />
      </div>
      {children}
    </div>
  );
};

export default layout;

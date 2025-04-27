// app/help/layout.tsx
import React from "react";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#fefefe]">{children}</div>;
}

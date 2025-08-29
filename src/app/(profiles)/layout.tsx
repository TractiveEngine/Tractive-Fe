// app/help/layout.tsx
"use client";
export default function RoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#fefefe]">{children}</div>;
}

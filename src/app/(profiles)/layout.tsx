// app/help/layout.tsx
"use client";
export default function RoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#f1f1f1]">{children}</div>;
}

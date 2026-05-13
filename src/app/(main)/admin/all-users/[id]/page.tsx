import React from "react";
import { UserDetailContainer } from "./_components/UserDetailContainer";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
      <UserDetailContainer userId={id} />
    </div>
  );
}

import type { Metadata } from "next";

import { buildUserMetadata } from "@/entities/user/model/buildUserMetadata";

import UserDetailClient from "./UserDetailClient";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> => {
  const { userId } = await params;
  return buildUserMetadata(userId, "ko");
};

const Page = () => <UserDetailClient />;

export default Page;

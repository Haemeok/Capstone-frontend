import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

const CommentsLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default CommentsLayout;

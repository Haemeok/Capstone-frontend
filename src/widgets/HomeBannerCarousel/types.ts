export type BannerSlide = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  badge?: {
    text: string;
    variant?: "default" | "success" | "warning";
  };
  highlight?: {
    text: string;
    color?: string;
  };
};

export type ButtonVariant = "black" | "white";

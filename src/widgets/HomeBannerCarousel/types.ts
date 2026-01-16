export type BannerSlide = {
  id: string;
  title: string;
  subTitle?: string;
  description?: string; // Keeping for backward compatibility or changing usage
  image: string;
  link: string;
  badge?: {
    text: string;
    variant?: "default" | "success" | "warning" | "event" | "new";
  };
  highlight?: {
    text: string;
    color?: string;
  };
  backgroundColor?: string; // Hex code or Tailwind class
  imagePosition?: "left" | "right";
};

export type ButtonVariant = "black" | "white";

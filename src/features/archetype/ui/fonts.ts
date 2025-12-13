import { Roboto_Mono, Alegreya } from "next/font/google";

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const alegreya = Alegreya({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-alegreya",
});

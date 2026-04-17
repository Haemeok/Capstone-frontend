import { Alegreya, Noto_Serif_KR,Roboto_Mono } from "next/font/google";

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

export const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-noto-serif-kr",
});

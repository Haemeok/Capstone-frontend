import { CSSProperties } from "react";

function hashString(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

export function generateUserGradient(userId: string): CSSProperties {
  // Handle empty userId edge case - warm neutral pastel
  if (!userId || userId.trim() === "") {
    return {
      background: "hsl(25, 50%, 85%)",
    };
  }

  // Convert to string if not already (handles non-string userId)
  const userIdString = String(userId);

  // Generate hue from full spectrum for maximum diversity
  const hue = hashString(userIdString, 360);

  const saturation = 50 + hashString(userIdString + "sat", 16);

  // Keep lightness high for pastel effect but vary slightly
  const lightness = 82 + hashString(userIdString + "light", 6); // 82-87%

  // Create solid pastel color
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return {
    background: color,
  };
}

export function isDefaultProfileImage(imageUrl: string): boolean {
  return imageUrl.includes("profiles/default/");
}

import { CSSProperties } from "react";

/**
 * Hashes a string to a number within a specified range
 * @param str - String to hash
 * @param max - Maximum value (exclusive)
 * @returns Hash value between 0 and max-1
 */
function hashString(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

/**
 * Generates a consistent solid pastel background color from a user ID string
 * Uses diverse pastel tones to complement fruit-themed default profile images
 * @param userId - User ID string to generate color from
 * @returns CSS background style object for React inline styles
 */
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

  // Vary saturation for more natural, diverse pastel colors
  // Higher saturation (50-65%) for more vibrant pastels while staying soft
  const saturation = 50 + hashString(userIdString + "sat", 16); // 50-65%

  // Keep lightness high for pastel effect but vary slightly
  const lightness = 82 + hashString(userIdString + "light", 6); // 82-87%

  // Create solid pastel color
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return {
    background: color,
  };
}

/**
 * Checks if profile image URL is a default image
 * @param imageUrl - Profile image URL to check
 * @returns true if URL contains 'profiles/default/'
 */
export function isDefaultProfileImage(imageUrl: string): boolean {
  return imageUrl.includes("profiles/default/");
}

export interface AccentColorStyles {
  backgroundColor: string;
  color: string;
  borderColor: string;
  hoverBackgroundColor: string;
  focusBackgroundColor: string;
}

export const getAccentColorStyles = (accentColor?: string): AccentColorStyles => {
  const baseColor = accentColor || "#2563eb";
  
  return {
    backgroundColor: baseColor,
    color: "#ffffff",
    borderColor: baseColor,
    hoverBackgroundColor: adjustColorBrightness(baseColor, -10),
    focusBackgroundColor: adjustColorBrightness(baseColor, -15),
  };
};

export const getAccentColorClasses = (accentColor?: string): string => {
  // For cases where we need to use the color as text color or border color
  return accentColor ? `text-[${accentColor}]` : "text-blue-600";
};

// Helper function to adjust color brightness
const adjustColorBrightness = (hex: string, percent: number): string => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);
  
  // Adjust brightness
  const adjustedR = Math.max(0, Math.min(255, r + (r * percent / 100)));
  const adjustedG = Math.max(0, Math.min(255, g + (g * percent / 100)));
  const adjustedB = Math.max(0, Math.min(255, b + (b * percent / 100)));
  
  // Convert back to hex
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  
  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
};

export const getStepNumberStyles = (accentColor?: string) => {
  const baseColor = accentColor || "#2563eb";
  return {
    backgroundColor: baseColor,
    color: "#ffffff"
  };
};

export const getBankDetailsStyles = (accentColor?: string) => {
  const baseColor = accentColor || "#2563eb";
  
  // Use white background with subtle accent color border and text
  const borderColor = adjustColorBrightness(baseColor, 30); // Lighter border
  const textColor = adjustColorBrightness(baseColor, -25);
  
  return {
    backgroundColor: "#ffffff", // Pure white background
    borderColor: borderColor,
    textColor: textColor,
    headingColor: adjustColorBrightness(baseColor, -35),
    labelColor: adjustColorBrightness(baseColor, -15),
  };
};

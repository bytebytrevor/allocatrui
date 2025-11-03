import { Dock, Wrench, Hammer, Palette, Zap, FileBox } from "lucide-react";
import type { JSX } from "react";

const size = 36; 

// Map project type to a function that returns JSX with styling
const projectTypeIcons: Record<string, () => JSX.Element> = {
  "Digital": () => <Dock size={size} className="bg-muted-foreground/16 rounded-sm p-2 text-blue-500" />,
  "Home Service": () => <Wrench size={size} className="bg-muted-foreground/16 rounded-sm p-2 text-orange-500" />,
  "Construction": () => <Hammer size={size} className="bg-muted-foreground/16 rounded-sm p-2 text-yellow-600" />,
  "Creative": () => <Palette size={size} className="bg-muted-foreground/16 rounded-sm p-2 text-pink-500" />,
};

// Optional: default icon if type not found
export const getProjectIcon = (type: string): JSX.Element => {
  return projectTypeIcons[type]?.() ?? <FileBox size={size} className="bg-muted-foreground/16 rounded-sm p-2 text-gray-400" />;
};

export default projectTypeIcons;
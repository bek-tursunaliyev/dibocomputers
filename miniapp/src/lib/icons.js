import {
  Newspaper,
  BadgePercent,
  Gamepad2,
  Briefcase,
  Mouse,
  Cpu,
  Monitor,
  Keyboard,
  Rocket,
  Sparkles,
  Percent,
  ShoppingBag,
  Laptop,
  Star,
  Zap,
} from "lucide-react";

export const ICON_MAP = {
  Newspaper,
  BadgePercent,
  Gamepad2,
  Briefcase,
  Mouse,
  Cpu,
  Monitor,
  Keyboard,
  Rocket,
  Sparkles,
  Percent,
  ShoppingBag,
  Laptop,
  Star,
  Zap,
};

export function getIcon(name) {
  return ICON_MAP[name] || Sparkles;
}

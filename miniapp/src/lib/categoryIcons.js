import { Laptop, Cpu, Monitor, Mouse, Package } from "lucide-react";

const MAP = {
  Noutbuklar: Laptop,
  Kompyuterlar: Cpu,
  Monitorlar: Monitor,
  Aksessuarlar: Mouse,
};

export function getCategoryIcon(name) {
  return MAP[name] || Package;
}

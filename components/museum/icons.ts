import { BadgePercent, Bone, CalendarDays, Microscope, Mountain, Pickaxe, Users, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { HighlightIcon } from "@/data/museums";

export const HIGHLIGHT_ICONS: Record<HighlightIcon, LucideIcon> = {
  skeleton: Bone,
  dig: Pickaxe,
  free: BadgePercent,
  food: UtensilsCrossed,
  lab: Microscope,
  view: Mountain,
  calendar: CalendarDays,
  family: Users,
};

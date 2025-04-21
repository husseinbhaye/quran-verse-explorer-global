
import React from "react";
import { Menu } from "lucide-react";

interface SidebarToggleButtonProps {
  onClick: () => void;
}

const SidebarToggleButton = ({ onClick }: SidebarToggleButtonProps) => (
  <button
    className="fixed top-3 left-3 z-30 block md:hidden p-2 bg-quran-primary text-white rounded-full shadow-md"
    aria-label="Show chapter menu"
    onClick={onClick}
    type="button"
  >
    <Menu size={24} />
  </button>
);

export default SidebarToggleButton;

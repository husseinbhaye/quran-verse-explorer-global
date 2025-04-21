
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

interface TextSizeControlProps {
  textSize: "sm" | "base" | "lg" | "xl";
  setTextSize: (size: "sm" | "base" | "lg" | "xl") => void;
}

const SIZES: Array<"sm" | "base" | "lg" | "xl"> = ["sm", "base", "lg", "xl"];

const TextSizeControl: React.FC<TextSizeControlProps> = ({ textSize, setTextSize }) => {
  const currentIdx = SIZES.indexOf(textSize);

  const handleIncrease = () => {
    if (currentIdx < SIZES.length - 1) {
      const newSize = SIZES[currentIdx + 1];
      console.log("Increasing size to:", newSize);
      setTextSize(newSize);
    }
  };

  const handleDecrease = () => {
    if (currentIdx > 0) {
      const newSize = SIZES[currentIdx - 1];
      console.log("Decreasing size to:", newSize);
      setTextSize(newSize);
    }
  };

  console.log("TextSizeControl rendered with current size:", textSize, "at index:", currentIdx);

  return (
    <div className="flex items-center gap-2 select-none">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={currentIdx === 0}
        aria-label="Decrease text size"
        className="text-quran-primary hover:bg-quran-primary/10 cursor-pointer pointer-events-auto"
        tabIndex={0}
        style={{ zIndex: 40 }}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
      <span className="text-sm mx-1 select-none font-semibold text-quran-primary" tabIndex={-1}>
        Text Size
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={currentIdx === SIZES.length - 1}
        aria-label="Increase text size"
        className="text-quran-primary hover:bg-quran-primary/10 cursor-pointer pointer-events-auto"
        tabIndex={0}
        style={{ zIndex: 40 }}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TextSizeControl;

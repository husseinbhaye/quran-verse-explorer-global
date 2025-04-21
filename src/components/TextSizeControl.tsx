
import React from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import { Button } from "./ui/button";

interface TextSizeControlProps {
  textSize: "sm" | "base" | "lg" | "xl";
  setTextSize: (size: "sm" | "base" | "lg" | "xl") => void;
}

const SIZES: Array<"sm" | "base" | "lg" | "xl"> = ["sm", "base", "lg", "xl"];

const TextSizeControl: React.FC<TextSizeControlProps> = ({ textSize, setTextSize }) => {
  const currentIdx = SIZES.indexOf(textSize);

  const increase = () => {
    if (currentIdx < SIZES.length - 1) {
      const newSize = SIZES[currentIdx + 1];
      console.log("Increasing size to:", newSize);
      setTextSize(newSize);
    }
  };
  
  const decrease = () => {
    if (currentIdx > 0) {
      const newSize = SIZES[currentIdx - 1];
      console.log("Decreasing size to:", newSize);
      setTextSize(newSize);
    }
  };

  console.log("TextSizeControl rendered with current size:", textSize, "at index:", currentIdx);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={decrease}
        disabled={currentIdx === 0}
        aria-label="Decrease text size"
        className="text-quran-primary hover:bg-quran-primary/10"
      >
        <CircleMinus />
      </Button>
      <span className="text-sm mx-1 select-none font-semibold text-quran-primary">
        Text Size
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={increase}
        disabled={currentIdx === SIZES.length - 1}
        aria-label="Increase text size"
        className="text-quran-primary hover:bg-quran-primary/10"
      >
        <CirclePlus />
      </Button>
    </div>
  );
};

export default TextSizeControl;

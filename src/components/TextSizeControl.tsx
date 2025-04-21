
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
    if (currentIdx < SIZES.length - 1) setTextSize(SIZES[currentIdx + 1]);
  };
  const decrease = () => {
    if (currentIdx > 0) setTextSize(SIZES[currentIdx - 1]);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={decrease}
        disabled={textSize === "sm"}
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
        disabled={textSize === "xl"}
        aria-label="Increase text size"
        className="text-quran-primary hover:bg-quran-primary/10"
      >
        <CirclePlus />
      </Button>
    </div>
  );
};

export default TextSizeControl;

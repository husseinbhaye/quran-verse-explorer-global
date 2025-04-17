
import React from 'react';
import { Repeat } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RepeatControlProps {
  repeatCount: number;
  currentRepeat: number;
  onRepeatChange: (value: number) => void;
}

const RepeatControl = ({ repeatCount, currentRepeat, onRepeatChange }: RepeatControlProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={repeatCount.toString()}
        onValueChange={(value) => onRepeatChange(Number(value))}
      >
        <SelectTrigger className="w-[100px] h-8">
          <Repeat className="h-4 w-4 mr-1" />
          <SelectValue placeholder="Repeat" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 10].map((count) => (
            <SelectItem key={count} value={count.toString()}>
              {count}x
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentRepeat > 0 && (
        <span className="text-xs text-muted-foreground">
          {currentRepeat}/{repeatCount}
        </span>
      )}
    </div>
  );
};

export default RepeatControl;

import { X } from "lucide-react";
import { Card } from "@/components/ui";
import Button from "@/components/ui/button";

interface FilterBarProps {
  children: React.ReactNode;
  onClear?: () => void;
  hasActiveFilters?: boolean;
}

export default function FilterBar({ children, onClear, hasActiveFilters }: FilterBarProps) {
  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-wrap items-end gap-3">
        {children}
        {hasActiveFilters && onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            leftIcon={<X className="w-3.5 h-3.5" />}
          >
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
}

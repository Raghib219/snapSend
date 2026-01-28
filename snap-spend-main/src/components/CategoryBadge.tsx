
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const badgeClasses = {
    'Food': 'bg-slate-500 text-white',
    'Travel': 'bg-slate-600 text-white',
    'Bills': 'bg-slate-700 text-white',
    'Shopping': 'bg-slate-800 text-white',
    'Entertainment': 'bg-slate-900 text-white',
    'Other': 'bg-slate-400 text-white',
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeClasses[category],
        className
      )}
    >
      {category}
    </span>
  );
}

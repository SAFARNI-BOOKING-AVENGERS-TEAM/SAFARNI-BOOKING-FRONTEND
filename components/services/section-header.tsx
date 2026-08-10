import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  title,
  description,
  viewAllHref,
}: {
  title: string;
  description?: string;
  viewAllHref?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:underline flex-shrink-0"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

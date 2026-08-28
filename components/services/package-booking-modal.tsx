"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, FormInput } from "@/components/ui";
import { useBookPackage } from "@/lib/hooks/use-packages";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { formatPrice } from "@/lib/utils";
import type { PackageResolvedItem } from "@/types";

interface PackageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  packageTitle: string;
  items: PackageResolvedItem[];
  estimatedFinalPrice: number;
}

interface ItemDates { startDate: string; endDate: string; }

function itemLabel(item: PackageResolvedItem) {
  if (item.category === "hotels") {
    return `${item.hotel?.name ?? "Hotel"} — ${item.room?.name ?? ""}`;
  }

  const doc = item.item;
  if (!doc) return "Item";
  if ("title" in doc) return doc.title;
  if ("brand" in doc) return doc.brand;
  if ("flightNumber" in doc) return doc.flightNumber;
  return "Item";
}

export default function PackageBookingModal({
  isOpen,
  onClose,
  packageId,
  packageTitle,
  items,
  estimatedFinalPrice,
}: PackageBookingModalProps) {
  const router = useRouter();
  const [dates, setDates] = useState<Record<number, ItemDates>>({});
  const bookPackage = useBookPackage(packageId);
  const toast = useToast();

  const updateDate = (idx: number, field: keyof ItemDates, value: string) => {
    setDates((prev) => ({
      ...prev,
      [idx]: { startDate: prev[idx]?.startDate ?? "", endDate: prev[idx]?.endDate ?? "", [field]: value },
    }));
  };

  const allDatesFilled = items.every((_, idx) => dates[idx]?.startDate && dates[idx]?.endDate);

  const handleSubmit = () => {
    if (!allDatesFilled) {
      toast.warning("Pick dates for every item in this package");
      return;
    }

    const payload = items.map((item, idx) => ({
      category: item.category,
      itemId: item.itemId,
      startDate: dates[idx].startDate,
      endDate: dates[idx].endDate,
    }));

    bookPackage.mutate(payload, {
      onSuccess: (response) => {
        toast.success("Package booking created", "Complete one payment to confirm all included bookings.");
        onClose();
        router.push(`/checkout?packageBookingId=${encodeURIComponent(response.data.packageBookingId)}`);
      },
      onError: (err) => toast.error("Booking failed", getApiErrorMessage(err)),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${packageTitle}`} size="lg">
      <p className="text-sm text-gray-500 mb-4">Pick dates for each item included in this package.</p>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900 mb-2">{itemLabel(item)}</p>
            <div className="grid grid-cols-2 gap-2">
              <FormInput label="Start" type="date" value={dates[idx]?.startDate ?? ""} onChange={(e) => updateDate(idx, "startDate", e.target.value)} />
              <FormInput label="End" type="date" min={dates[idx]?.startDate} value={dates[idx]?.endDate ?? ""} onChange={(e) => updateDate(idx, "endDate", e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-base font-semibold text-gray-900">
        <span>Estimated total</span><span>{formatPrice(estimatedFinalPrice)}</span>
      </div>
      <Button className="w-full mt-4" onClick={handleSubmit} isLoading={bookPackage.isPending}>Continue to payment</Button>
    </Modal>
  );
}

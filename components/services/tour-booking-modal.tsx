"use client";

import { useMemo, useState } from "react";
import { Modal, Button, Select, FormInput } from "@/components/ui";
import { useCreateBooking } from "@/lib/hooks/use-bookings";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Tour } from "@/types";

interface TourBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour;
}

export default function TourBookingModal({ isOpen, onClose, tour }: TourBookingModalProps) {
  // The backend matches startDate against tour.startDates by exact day, so
  // this has to be a fixed choice, not a free date picker.
  const dateOptions = useMemo(
    () =>
      (tour.startDates ?? [])
        .filter((sd) => new Date(sd.date) >= new Date(new Date().toDateString()))
        .map((sd) => ({ value: sd.date, label: `${formatDate(sd.date)} · ${sd.capacity} spots` })),
    [tour.startDates]
  );
  const tierOptions = tour.priceTiers.map((t) => ({
    value: t.type,
    label: `${t.type} — ${formatPrice(t.price)}`,
  }));

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTier, setSelectedTier] = useState(tour.priceTiers[0]?.type ?? "");
  const [guests, setGuests] = useState(1);

  const createBooking = useCreateBooking();
  const toast = useToast();

  const unitPrice =
    tour.priceTiers.find((t) => t.type === selectedTier)?.price ?? tour.priceTiers[0]?.price ?? 0;
  const total = unitPrice * guests;

  const handleSubmit = () => {
    if (!selectedDate) {
      toast.warning("Pick a departure date");
      return;
    }
    createBooking.mutate(
      {
        category: "tours",
        itemId: tour._id,
        startDate: selectedDate,
        endDate: selectedDate,
        details: { priceTier: selectedTier, guests },
      },
      {
        onSuccess: () => {
          toast.success("Tour booked!", tour.title);
          onClose();
        },
        onError: (err) => toast.error("Booking failed", getApiErrorMessage(err)),
      }
    );
  };

  if (dateOptions.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Book ${tour.title}`}>
        <p className="text-sm text-gray-500">
          There are no upcoming departure dates for this tour right now.
        </p>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${tour.title}`}>
      <div className="space-y-3">
        <Select
          label="Departure date"
          placeholder="Choose a date"
          options={dateOptions}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Select
          label="Price tier"
          options={tierOptions}
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
        />
        <FormInput
          label="Guests"
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            {formatPrice(unitPrice)} × {guests} guest{guests === 1 ? "" : "s"}
          </span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <Button className="w-full mt-4" onClick={handleSubmit} isLoading={createBooking.isPending}>
        Confirm booking
      </Button>
    </Modal>
  );
}

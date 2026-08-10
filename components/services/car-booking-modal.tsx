"use client";

import { useMemo, useState } from "react";
import { Modal, Button } from "@/components/ui";
import DateRangeFields from "./date-range-fields";
import { useCreateBooking } from "@/lib/hooks/use-bookings";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { formatPrice } from "@/lib/utils";
import type { Car } from "@/types";

interface CarBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
}

export default function CarBookingModal({ isOpen, onClose, car }: CarBookingModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const createBooking = useCreateBooking();
  const toast = useToast();

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }, [startDate, endDate]);

  const total = days * car.pricePerDay;

  const handleSubmit = () => {
    if (!startDate || !endDate || days <= 0) {
      toast.warning("Pick a valid pick-up and drop-off date");
      return;
    }
    createBooking.mutate(
      { category: "cars", itemId: car._id, startDate, endDate },
      {
        onSuccess: () => {
          toast.success("Car booked!", `${car.brand} ${car.model}`);
          onClose();
        },
        onError: (err) => toast.error("Booking failed", getApiErrorMessage(err)),
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${car.brand} ${car.model}`}>
      <DateRangeFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        startLabel="Pick-up"
        endLabel="Drop-off"
      />

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            {formatPrice(car.pricePerDay)} × {days} day{days === 1 ? "" : "s"}
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

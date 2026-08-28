"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button } from "@/components/ui";
import DateRangeFields from "./date-range-fields";
import { useCreateBooking } from "@/lib/hooks/use-bookings";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { formatPrice } from "@/lib/utils";
import type { Room } from "@/types";

interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  hotelName: string;
}

export default function HotelBookingModal({ isOpen, onClose, room, hotelName }: HotelBookingModalProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const createBooking = useCreateBooking();
  const toast = useToast();

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }, [startDate, endDate]);

  const total = nights * room.pricePerNight;

  const handleSubmit = () => {
    if (!startDate || !endDate || nights <= 0) {
      toast.warning("Pick valid check-in and check-out dates");
      return;
    }
    createBooking.mutate(
      { category: "hotels", itemId: room._id, startDate, endDate },
      {
        onSuccess: (response) => {
          toast.success("Booking created", "Complete payment to confirm your room.");
          onClose();
          router.push(`/checkout?bookingId=${encodeURIComponent(response.data._id)}`);
        },
        onError: (err) => toast.error("Booking failed", getApiErrorMessage(err)),
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${room.name}`}>
      <p className="text-sm text-gray-500 mb-4">{hotelName}</p>
      <DateRangeFields startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatPrice(room.pricePerNight)} × {nights} night{nights === 1 ? "" : "s"}</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-gray-900"><span>Total</span><span>{formatPrice(total)}</span></div>
      </div>
      <Button className="w-full mt-4" onClick={handleSubmit} isLoading={createBooking.isPending}>Continue to payment</Button>
    </Modal>
  );
}

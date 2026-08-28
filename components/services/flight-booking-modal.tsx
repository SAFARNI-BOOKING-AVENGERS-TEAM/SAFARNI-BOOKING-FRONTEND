"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, FormInput } from "@/components/ui";
import { useCreateBooking } from "@/lib/hooks/use-bookings";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";
import type { Flight } from "@/types";

interface FlightBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight;
}

export default function FlightBookingModal({ isOpen, onClose, flight }: FlightBookingModalProps) {
  const router = useRouter();
  const [passengers, setPassengers] = useState(1);
  const createBooking = useCreateBooking();
  const toast = useToast();
  const total = passengers * flight.price;

  const handleSubmit = () => {
    if (passengers < 1 || passengers > flight.availableSeats) {
      toast.warning(`Choose between 1 and ${flight.availableSeats} passengers`);
      return;
    }
    createBooking.mutate(
      {
        category: "flights",
        itemId: flight._id,
        startDate: flight.departureTime,
        endDate: flight.arrivalTime,
        details: { quantity: passengers },
      },
      {
        onSuccess: (response) => {
          toast.success("Booking created", "Complete payment to confirm your flight.");
          onClose();
          router.push(`/checkout?bookingId=${encodeURIComponent(response.data._id)}`);
        },
        onError: (err) => toast.error("Booking failed", getApiErrorMessage(err)),
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${flight.flightNumber}`}>
      <p className="text-sm text-gray-500 mb-4">
        {flight.departureAirport} → {flight.arrivalAirport} · {formatDate(flight.departureTime)} at {formatTime(flight.departureTime)}
      </p>
      <FormInput label="Passengers" type="number" min={1} max={flight.availableSeats} value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} />
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatPrice(flight.price)} × {passengers} passenger{passengers === 1 ? "" : "s"}</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-gray-900"><span>Total</span><span>{formatPrice(total)}</span></div>
      </div>
      <Button className="w-full mt-4" onClick={handleSubmit} isLoading={createBooking.isPending}>Continue to payment</Button>
    </Modal>
  );
}

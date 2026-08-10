import Link from "next/link";
import { Plane } from "lucide-react";
import { Card } from "@/components/ui";
import FavoriteButton from "./favorite-button";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import type { Flight } from "@/types";

export default function FlightCard({ flight }: { flight: Flight }) {
  return (
    <Link href={`/flights/${flight._id}`} className="block">
      <Card className="p-4 hover:shadow-md transition-shadow relative">
        <div className="absolute top-3 right-3">
          <FavoriteButton category="flights" itemId={flight._id} />
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap pr-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Plane className="w-4 h-4 text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{flight.airline}</p>
              <p className="text-xs text-gray-500">
                {flight.flightNumber} · {flight.class}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="text-center">
              <p className="font-semibold text-gray-900">{flight.departureAirport}</p>
              <p className="text-xs text-gray-500">{formatTime(flight.departureTime)}</p>
            </div>
            <div className="w-12 h-px bg-gray-300" />
            <div className="text-center">
              <p className="font-semibold text-gray-900">{flight.arrivalAirport}</p>
              <p className="text-xs text-gray-500">{formatTime(flight.arrivalTime)}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-base font-semibold text-gray-900">{formatPrice(flight.price)}</p>
            <p className="text-xs text-gray-500">{flight.availableSeats} seats left</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">{formatDate(flight.departureTime)}</p>
      </Card>
    </Link>
  );
}

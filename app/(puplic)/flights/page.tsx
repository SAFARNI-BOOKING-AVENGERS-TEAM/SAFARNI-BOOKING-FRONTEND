"use client";

import { useState } from "react";
import { Plane } from "lucide-react";
import { useFlights } from "@/lib/hooks/use-flights";
import { FormInput, Select, Skeleton, EmptyState } from "@/components/ui";
import FlightCard from "@/components/services/flight-card";
import FilterBar from "@/components/services/filter-bar";

const classOptions = ["Economy", "Business", "First"].map((c) => ({ value: c, label: c }));

export default function FlightsPage() {
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [date, setDate] = useState("");
  const [flightClass, setFlightClass] = useState("");

  const { data, isLoading, isError } = useFlights({
    departureAirport: departureAirport || undefined,
    arrivalAirport: arrivalAirport || undefined,
    date: date || undefined,
    class: flightClass || undefined,
  });

  const hasActiveFilters = !!departureAirport || !!arrivalAirport || !!date || !!flightClass;
  const clearFilters = () => {
    setDepartureAirport("");
    setArrivalAirport("");
    setDate("");
    setFlightClass("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Flights</h1>
      <p className="text-sm text-gray-500 mb-6">Search flights by route and date</p>

      <FilterBar onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
        <div className="w-36">
          <FormInput
            label="From"
            placeholder="e.g. CAI"
            maxLength={3}
            value={departureAirport}
            onChange={(e) => setDepartureAirport(e.target.value.toUpperCase())}
          />
        </div>
        <div className="w-36">
          <FormInput
            label="To"
            placeholder="e.g. DXB"
            maxLength={3}
            value={arrivalAirport}
            onChange={(e) => setArrivalAirport(e.target.value.toUpperCase())}
          />
        </div>
        <div className="w-44">
          <FormInput label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="w-40">
          <Select
            label="Class"
            placeholder="Any class"
            options={classOptions}
            value={flightClass}
            onChange={(e) => setFlightClass(e.target.value)}
          />
        </div>
      </FilterBar>

      {isLoading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Couldn't load flights" description="Please try again." />
      ) : !data?.data.length ? (
        <EmptyState icon={Plane} title="No flights found" description="Try a different route or date." />
      ) : (
        <div className="space-y-3">
          {data.data.map((flight) => (
            <FlightCard key={flight._id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  );
}

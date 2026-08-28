"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Bot,
  Clock3,
  ExternalLink,
  Plane,
  Search,
  Sparkles,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { aiSearchApi } from "@/lib/api/ai-search";
import { getApiErrorMessage } from "@/lib/api/error";
import type { AIFlightResult, AIFlightSearchResponse } from "@/types";

const examples = [
  "Show me the 5 cheapest nonstop flights from Cairo to Paris next Friday",
  "Find 3 cheap flights from CAI to DXB on 2026-09-20 for 2 adults",
  "Business class from Cairo to London on 2026-10-05",
];

function durationLabel(minutes: number | null) {
  if (minutes == null) return "Duration unavailable";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours ? `${hours}h ` : ""}${mins}m`.trim();
}

function dateTimeLabel(value: string | null) {
  if (!value) return "Time unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function priceLabel(result: AIFlightResult) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: result.currency,
      maximumFractionDigits: 2,
    }).format(result.price);
  } catch {
    return `${result.price.toFixed(2)} ${result.currency}`;
  }
}

function ResultCard({ flight }: { flight: AIFlightResult }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex items-center gap-3 lg:w-56 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Plane className="w-5 h-5 text-gray-700" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400">#{flight.rank}</span>
                <p className="font-semibold text-gray-900 truncate">
                  {flight.airlineName || flight.airlineCode || "Airline"}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {[flight.airlineCode, flight.flightNumber].filter(Boolean).join(" ") || "Live external fare"}
              </p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Departure</p>
              <p className="font-medium text-gray-900 mt-0.5">{dateTimeLabel(flight.departure)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Arrival</p>
              <p className="font-medium text-gray-900 mt-0.5">{dateTimeLabel(flight.arrival)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Journey</p>
              <p className="font-medium text-gray-900 mt-0.5">
                {durationLabel(flight.durationMinutes)} · {flight.stops === 0 ? "Nonstop" : `${flight.stops ?? "?"} stop${flight.stops === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>

          <div className="lg:text-right lg:w-44 flex-shrink-0">
            <p className="text-xl font-bold text-gray-900">{priceLabel(flight)}</p>
            {flight.quoteAgeMinutes != null && (
              <p className="text-xs text-gray-500 mt-0.5">Quote age: {flight.quoteAgeMinutes} min</p>
            )}
            {flight.bookingUrl ? (
              <a
                href={flight.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-gray-900 hover:underline"
              >
                View deal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <p className="text-xs text-gray-400 mt-3">Booking link unavailable</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AISearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [prompt, setPrompt] = useState(initialQuery);
  const [response, setResponse] = useState<AIFlightSearchResponse | null>(null);

  const mutation = useMutation({
    mutationFn: (value: string) => aiSearchApi.searchFlights(value),
    onSuccess: (result) => setResponse(result.data),
  });

  useEffect(() => {
    if (initialQuery.trim()) mutation.mutate(initialQuery.trim());
    // Run only for the query that arrived with this navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const missingText = useMemo(() => {
    if (response?.status !== "needs_input") return "";
    const missing = response.intent.missingFields;
    return missing.length ? missing.join(", ") : "more trip details";
  }, [response]);

  const submit = () => {
    const value = prompt.trim();
    if (value.length < 5 || mutation.isPending) return;
    setResponse(null);
    mutation.mutate(value);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
          <Sparkles className="w-3.5 h-3.5" /> Ask SAFARNI
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">Tell us the trip. We&apos;ll search the flights.</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl mx-auto">
          Describe what you need in normal language. SAFARNI turns it into a live flight search and ranks real external offers for you.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto mt-8">
        <CardContent className="p-5 sm:p-6">
          <label htmlFor="ai-flight-prompt" className="text-sm font-semibold text-gray-900">What are you looking for?</label>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <textarea
              id="ai-flight-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Example: Show me the 5 cheapest nonstop flights from Cairo to Paris next Friday"
              className="flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              maxLength={500}
            />
            <Button
              className="sm:self-stretch sm:w-36"
              onClick={submit}
              isLoading={mutation.isPending}
              leftIcon={<Search className="w-4 h-4" />}
            >
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setPrompt(example)}
                className="text-left text-xs px-3 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {mutation.isError && (
        <div className="max-w-4xl mx-auto mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {getApiErrorMessage(mutation.error)}
        </div>
      )}

      {mutation.isPending && (
        <div className="max-w-4xl mx-auto mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <Bot className="w-8 h-8 text-gray-500 mx-auto animate-pulse" />
          <p className="font-medium text-gray-900 mt-3">Understanding your trip and checking live fares…</p>
          <p className="text-xs text-gray-500 mt-1">External flight searches can take a few seconds.</p>
        </div>
      )}

      {response?.status === "needs_input" && (
        <Card className="max-w-4xl mx-auto mt-6">
          <CardContent className="p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">I need one more detail</h2>
              <p className="text-sm text-gray-600 mt-1">{response.intent.summary}</p>
              <p className="text-sm text-gray-500 mt-2">Please add: <span className="font-medium text-gray-700">{missingText}</span>.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {response?.status === "results" && (
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Best live matches</h2>
                {response.cached && <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-600">Cached</span>}
              </div>
              <p className="text-sm text-gray-500 mt-1">{response.intent.summary}</p>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <Clock3 className="w-3.5 h-3.5" /> {response.source}
            </div>
          </div>

          {!response.results.length ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Plane className="w-8 h-8 text-gray-400 mx-auto" />
                <h3 className="font-semibold text-gray-900 mt-3">No live offers matched this search</h3>
                <p className="text-sm text-gray-500 mt-1">Try another date, airport, or remove the nonstop restriction.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {response.results.map((flight) => <ResultCard key={`${flight.itineraryId}-${flight.rank}`} flight={flight} />)}
            </div>
          )}

          <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
            Live offers come from an external flight provider and may change before checkout. SAFARNI does not alter the quoted fare. External deal links open the provider&apos;s booking flow.
          </div>
        </section>
      )}

      <div className="max-w-4xl mx-auto mt-8 flex justify-center">
        <Link href="/flights" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
          Prefer normal search? Browse SAFARNI flights <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function AISearchPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-500">Loading Ask SAFARNI…</div>}>
      <AISearchContent />
    </Suspense>
  );
}

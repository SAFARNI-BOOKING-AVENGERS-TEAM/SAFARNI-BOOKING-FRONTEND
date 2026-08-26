"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Car, Plane, MapPin, Package, Smartphone, Sparkles, Search } from "lucide-react";
import { useFeaturedPackages } from "@/lib/hooks/use-packages";
import { useTours } from "@/lib/hooks/use-tours";
import { Badge, Button } from "@/components/ui";
import ListingCard from "@/components/services/listing-card";
import ListingGrid from "@/components/services/listing-grid";
import SectionHeader from "@/components/services/section-header";
import { formatPrice } from "@/lib/utils";

const categories = [
  { href: "/hotels", label: "Hotels", icon: Building2 },
  { href: "/tours", label: "Tours", icon: MapPin },
  { href: "/cars", label: "Cars", icon: Car },
  { href: "/flights", label: "Flights", icon: Plane },
  { href: "/packages", label: "Packages", icon: Package },
  { href: "/esim", label: "eSIM", icon: Smartphone },
];

export default function HomePage() {
  const router = useRouter();
  const [aiQuery, setAiQuery] = useState("");
  const featuredPackages = useFeaturedPackages(4);
  const popularTours = useTours({ recommended: true, limit: 4 });

  const startAISearch = () => {
    const value = aiQuery.trim();
    if (value.length < 5) return;
    router.push(`/ai-search?q=${encodeURIComponent(value)}`);
  };

  return (
    <div>
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-gray-100">
            <Sparkles className="w-3.5 h-3.5" /> Ask SAFARNI
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-4">
            Plan your next trip, all in one place
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto">
            Tours, hotels, car rentals, flights, and curated packages — plus AI-assisted live flight search across external offers.
          </p>

          <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-xl shadow-black/10">
            <input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") startAISearch();
              }}
              placeholder="Try: 5 cheapest nonstop flights from Cairo to Paris next Friday"
              className="flex-1 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none"
              maxLength={500}
            />
            <Button
              className="sm:w-36"
              onClick={startAISearch}
              leftIcon={<Search className="w-4 h-4" />}
            >
              Ask SAFARNI
            </Button>
          </div>
          <Link href="/ai-search" className="inline-block mt-3 text-xs text-gray-400 hover:text-white">
            Or open the full AI travel search
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="flex flex-col items-center gap-2 py-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <cat.icon className="w-5 h-5 text-gray-700" />
              </div>
              <span className="text-xs font-medium text-gray-700">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Featured packages"
          description="Curated bundles with a built-in discount"
          viewAllHref="/packages"
        />
        <ListingGrid
          items={featuredPackages.data?.data}
          isLoading={featuredPackages.isLoading}
          isError={featuredPackages.isError}
          keyExtractor={(pkg) => pkg._id}
          emptyIcon={Sparkles}
          emptyTitle="No featured packages yet"
          emptyDescription="Check back soon for curated deals."
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          renderItem={(pkg) => {
            const savings = Math.round(pkg.estimatedOriginalPrice * (pkg.discountPercentage / 100));
            const finalPrice = pkg.estimatedOriginalPrice - savings;
            return (
              <ListingCard
                href={`/packages/${pkg._id}`}
                image={pkg.coverImage}
                title={pkg.title}
                subtitle={pkg.country}
                badge={<Badge variant="danger">-{pkg.discountPercentage}%</Badge>}
                price={formatPrice(finalPrice)}
                originalPrice={formatPrice(pkg.estimatedOriginalPrice)}
                priceLabel="Estimated total"
              />
            );
          }}
        />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <SectionHeader
          title="Popular tours"
          description="Hand-picked experiences travelers love"
          viewAllHref="/tours"
        />
        <ListingGrid
          items={popularTours.data?.data}
          isLoading={popularTours.isLoading}
          isError={popularTours.isError}
          keyExtractor={(tour) => tour._id}
          emptyIcon={MapPin}
          emptyTitle="No tours yet"
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          renderItem={(tour) => {
            const avgRating =
              tour.reviews.length > 0
                ? tour.reviews.reduce((s, r) => s + r.rating, 0) / tour.reviews.length
                : 0;
            return (
              <ListingCard
                href={`/tours/${tour._id}`}
                image={tour.mainImage}
                title={tour.title}
                subtitle={tour.locations[0]?.name}
                rating={avgRating}
                reviewCount={tour.reviews.length}
                price={formatPrice(tour.priceTiers[0]?.price ?? 0)}
                priceLabel="From"
              />
            );
          }}
        />
      </section>
    </div>
  );
}

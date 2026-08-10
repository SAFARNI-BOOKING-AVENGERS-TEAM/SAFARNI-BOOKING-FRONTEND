"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Clock, Languages, Tag, CheckCircle2, XCircle } from "lucide-react";
import { useTourDetails, useTourReviews, useAddTourReview } from "@/lib/hooks/use-tours";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import {
  Card,
  CardContent,
  Button,
  StarRating,
  Skeleton,
  EmptyState,
  ImageGallery,
} from "@/components/ui";
import FavoriteButton from "@/components/services/favorite-button";
import TourBookingModal from "@/components/services/tour-booking-modal";
import { formatPrice } from "@/lib/utils";

export default function TourDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useTourDetails(id);
  const { data: reviewsData, isLoading: reviewsLoading } = useTourReviews(id);
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const addReview = useAddTourReview(id);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmptyState
          title="Tour not found"
          description="This tour may have been removed or isn't available."
        />
      </div>
    );
  }

  const tour = data.data;

  const handleBook = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/tours/${id}`;
      return;
    }
    setModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/tours/${id}`;
      return;
    }
    if (reviewRating === 0) {
      toast.warning("Pick a star rating first");
      return;
    }
    addReview.mutate(
      { rating: reviewRating, comment: reviewComment || undefined },
      {
        onSuccess: () => {
          toast.success("Review submitted");
          setReviewRating(0);
          setReviewComment("");
        },
        onError: (err) => toast.error("Couldn't submit review", getApiErrorMessage(err)),
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tour.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tour.locations.map((l) => l.name).join(" · ")}
          </p>
        </div>
        <FavoriteButton category="tours" itemId={tour._id} className="bg-gray-100 hover:bg-gray-200" />
      </div>

      <ImageGallery
        images={[tour.mainImage, ...(tour.gallery ?? [])]}
        alt={tour.title}
        className="mb-8"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            {tour.fullDescription || tour.summary}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" /> {tour.duration}
            </span>
            {tour.difficulty && (
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-gray-400" /> {tour.difficulty}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-gray-400" /> {tour.languages.join(", ")}
            </span>
          </div>

          {tour.highlights && tour.highlights.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Highlights</h2>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {((tour.inclusiveItems && tour.inclusiveItems.length > 0) ||
            (tour.exclusiveItems && tour.exclusiveItems.length > 0)) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tour.inclusiveItems && tour.inclusiveItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Included</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tour.inclusiveItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.exclusiveItems && tour.exclusiveItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Not included</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tour.exclusiveItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Reviews</h2>
            {reviewsLoading ? (
              <Skeleton className="h-24 w-full rounded-xl" />
            ) : reviewsData?.data.totalReviews === 0 ? (
              <p className="text-sm text-gray-500 mb-4">No reviews yet — be the first to leave one.</p>
            ) : (
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={reviewsData?.data.averageRating ?? 0} showValue />
                  <span className="text-sm text-gray-500">
                    ({reviewsData?.data.totalReviews} review
                    {reviewsData?.data.totalReviews === 1 ? "" : "s"})
                  </span>
                </div>
                {reviewsData?.data.reviews.map((review, i) => (
                  <Card key={review._id ?? i}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {review.userId?.name ?? "Traveler"}
                        </p>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 mt-1.5">{review.comment}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Leave a review</p>
                <p className="text-xs text-gray-500 mb-3">
                  You can review this tour after your booking for it has been confirmed.
                </p>
                <StarRating
                  rating={reviewRating}
                  interactive
                  onChange={setReviewRating}
                  size={22}
                  className="mb-3"
                />
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience (optional)"
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 mb-3"
                />
                <Button size="sm" onClick={handleSubmitReview} isLoading={addReview.isPending}>
                  Submit review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="h-fit">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 mb-1">From</p>
            <div className="space-y-2 mb-4">
              {tour.priceTiers.map((tier) => (
                <div key={tier.type} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{tier.type}</span>
                  <span className="font-semibold text-gray-900">{formatPrice(tier.price)}</span>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={handleBook}>
              Book this tour
            </Button>
            {tour.cancellationPolicy && (
              <p className="text-xs text-gray-400 mt-3">{tour.cancellationPolicy}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <TourBookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} tour={tour} />
    </div>
  );
}

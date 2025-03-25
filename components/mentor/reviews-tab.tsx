import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewForm } from "./review-form";
import { ReviewItem } from "./review-item";

interface ReviewsTabProps {
  mentor: any; // Replace with proper type
  onSubmitReview: (rating: number, comment: string) => Promise<void>;
  isSubmittingReview: boolean;
}

export function ReviewsTab({
  mentor,
  onSubmitReview,
  isSubmittingReview,
}: ReviewsTabProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmitReview = async (rating: number, comment: string) => {
    await onSubmitReview(rating, comment);
    setShowReviewForm(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Ulasan Mentee
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {mentor.reviewCount || 0} ulasan dari mentee
          </p>
        </div>
        {!showReviewForm && (
          <Button
            variant="outline"
            onClick={() => setShowReviewForm(true)}
            className="text-sm flex items-center gap-2"
          >
            <Star className="h-4 w-4" /> Tambah Ulasan
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showReviewForm && (
          <ReviewForm
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
            isSubmitting={isSubmittingReview}
          />
        )}

        {/* Display existing reviews */}
        {mentor.receivedReviews && mentor.receivedReviews.length > 0 ? (
          <div className="space-y-6 mt-6">
            {mentor.receivedReviews.map((review: any) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 border-2 border-dashed rounded-lg mt-6">
            <Star className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">
              Belum ada ulasan untuk mentor ini
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Jadilah yang pertama memberikan ulasan
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

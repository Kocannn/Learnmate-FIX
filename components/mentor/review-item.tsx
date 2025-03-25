import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { StarRating } from "./star-rating";

interface User {
  name?: string;
  profileImage?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: User;
}

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="border rounded-lg p-5 bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {review.user?.profileImage ? (
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={review.user.profileImage}
                alt={review.user?.name || "User"}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-semibold text-lg">
              {review.user?.name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">
              {review.user?.name || "Anonymous"}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              <span className="ml-1 text-xs font-medium text-primary">
                •{" "}
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </p>
          </div>
        </div>
        <div className="bg-secondary px-3 py-1.5 rounded-full">
          <StarRating rating={review.rating} size={16} />
        </div>
      </div>
      <div className="mt-4 text-sm text-card-foreground border-t pt-3">
        <p className="leading-relaxed">{review.comment}</p>
      </div>
    </div>
  );
}

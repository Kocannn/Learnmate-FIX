import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ReviewForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit(rating, comment);
  };

  return (
    <div className="mb-8 border rounded-lg p-6 bg-card shadow-sm">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-primary" />
        Tambahkan Ulasan
      </h3>
      <div className="mb-6">
        <Label htmlFor="rating" className="block mb-2 font-medium">
          Rating
        </Label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((starRating) => (
            <button
              key={starRating}
              type="button"
              onClick={() => setRating(starRating)}
              className="p-1.5 rounded-md transition-all hover:scale-110"
              title={`${starRating} star${starRating > 1 ? "s" : ""}`}
            >
              <Star
                size={28}
                className={
                  rating >= starRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <Label htmlFor="comment" className="block mb-2 font-medium">
          Komentar
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagikan pengalaman Anda dengan mentor ini..."
          className="w-full min-h-[120px] resize-none focus:ring-primary"
          rows={4}
        />
      </div>
      <div className="flex space-x-3">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !comment}
          className="px-6"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent mr-2"></div>
              Mengirim...
            </>
          ) : (
            "Kirim Ulasan"
          )}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </div>
  );
}

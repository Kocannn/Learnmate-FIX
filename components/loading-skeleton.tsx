import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  count?: number;
  isPast?: boolean;
}

export function LoadingSkeleton({
  count = 2,
  isPast = false,
}: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="p-6">
            {!isPast ? (
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            ) : (
              <Skeleton className="h-6 w-40" />
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
              {!isPast && <Skeleton className="h-4 w-40" />}
            </div>
          </CardContent>
          <CardFooter className="p-6 border-t">
            <div className="flex gap-4 w-full">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

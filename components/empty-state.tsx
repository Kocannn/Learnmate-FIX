import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  showAction?: boolean;
  actionLink?: string;
  actionText?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  showAction = false,
  actionLink = "/dashboard/mentors",
  actionText = "Temukan Mentor",
}: EmptyStateProps) {
  return (
    <Card className="w-full border-dashed bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {description}
        </p>
        {showAction && (
          <Button asChild>
            <Link href={actionLink}>
              {actionText} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

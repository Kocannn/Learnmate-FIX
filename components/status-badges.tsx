import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = "";
  let textColor = "";
  let label = "";

  switch (status) {
    case "confirmed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      label = "Terkonfirmasi";
      break;
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      label = "Menunggu Konfirmasi";
      break;
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      label = "Dibatalkan";
      break;
    case "completed":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      label = "Selesai";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      label = status;
  }

  return (
    <Badge
      className={`${bgColor} hover:${bgColor} ${textColor} px-3 py-1.5 rounded-full text-sm`}
    >
      {label}
    </Badge>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
}

export function SearchFilter({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
}: SearchFilterProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari berdasarkan topik atau nama mentor"
          className="pl-9"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when filtering
          }}
        />
      </div>
      <Button variant="outline" className="sm:w-auto w-full">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  );
}

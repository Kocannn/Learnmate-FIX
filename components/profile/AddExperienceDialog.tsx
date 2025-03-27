import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AddExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (experience: {
    company: string;
    position: string;
    duration: string;
    description?: string;
  }) => void;
}

export default function AddExperienceDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddExperienceDialogProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ company, position, duration, description });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pengalaman</DialogTitle>
          <DialogDescription>
            Tambahkan informasi pengalaman kerja Anda
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="company">Perusahaan</Label>
            <Input
              id="company"
              placeholder="Nama perusahaan"
              className="mt-1"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="position">Posisi</Label>
            <Input
              id="position"
              placeholder="Contoh: Software Engineer"
              className="mt-1"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="duration">Durasi</Label>
            <Input
              id="duration"
              placeholder="Contoh: 2020 - Sekarang"
              className="mt-1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              placeholder="Deskripsi singkat tentang peran dan tanggung jawab Anda"
              className="mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

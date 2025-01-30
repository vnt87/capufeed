import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { FeedRecord, FeedRecordUpdate } from "@/types/feed";

interface EditFeedDialogProps {
  record: FeedRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, updates: FeedRecordUpdate) => Promise<void>;
}

const formatForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function EditFeedDialog({ record, open, onOpenChange, onSubmit }: EditFeedDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [time, setTime] = useState(formatForInput(record.time));
  const [amount, setAmount] = useState(String(record.amount));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    const newTime = new Date(time);
    const now = new Date();
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast({
        variant: "destructive",
        title: t("invalidAmount"),
        description: t("pleaseEnterValidAmount"),
      });
      return;
    }

    if (isNaN(newTime.getTime()) || newTime > now) {
      toast({
        variant: "destructive",
        title: t("invalidTime"),
        description: t("pleaseEnterValidTime"),
      });
      return;
    }

    try {
      await onSubmit(record.id, {
        time: newTime,
        amount: numAmount,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("updateError"),
        description: error instanceof Error ? error.message : t("updateError"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("editRecord")}</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div>
              <Label htmlFor="time">
                {t("editTime")}
              </Label>
              <Input
                id="time"
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2"
                max={formatForInput(new Date())}
              />
            </div>
            <div>
              <Label htmlFor="editAmount">
                {t("editAmount")}
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  id="editAmount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-right"
                  min="0"
                  step="5"
                />
                <span className="text-sm text-muted-foreground">ml</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import type { FeedRecord, FeedRecordUpdate } from "@/types/feed";

interface EditFeedDialogProps {
  record: FeedRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, updates: FeedRecordUpdate) => Promise<void>;
}

export function EditFeedDialog({ record, open, onOpenChange, onSubmit }: EditFeedDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [date, setDate] = useState(record.time);
  const isMobile = useIsMobile();
  const [amount, setAmount] = useState(String(record.amount));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    const now = new Date();
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast({
        variant: "destructive",
        title: t("invalidAmount"),
        description: t("pleaseEnterValidAmount"),
      });
      return;
    }

    if (date > now) {
      toast({
        variant: "destructive",
        title: t("invalidTime"),
        description: t("pleaseEnterValidTime"),
      });
      return;
    }

    try {
      await onSubmit(record.id, {
        time: date,
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
      <DialogContent className={isMobile ? "translate-y-[-20%]" : ""}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("editRecord")}</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label>{t("editTime")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPpp")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <Input
                      type="time"
                      value={format(date, "HH:mm")}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(":");
                        const newDate = new Date(date);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setDate(newDate);
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
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

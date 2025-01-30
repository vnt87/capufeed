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

interface FeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (amount: number) => void;
}

export function FeedDialog({ open, onOpenChange, onSubmit }: FeedDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast({
        variant: "destructive",
        title: t("invalidAmount"),
        description: t("pleaseEnterValidAmount"),
      });
      return;
    }

    onSubmit(numAmount);
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("enterFeedAmount")}</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Label htmlFor="amount" className="text-right">
              {t("amount")}
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="120"
                className="text-right"
                min="0"
                step="5"
              />
              <span className="text-sm text-muted-foreground">ml</span>
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

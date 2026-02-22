"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CUSTOM_ORDER_METHODS, CUSTOM_OPTION_TYPES } from "@/lib/seo/constants";
import type { CustomOrderDetails } from "@/types/product";

interface CustomOrderToggleProps {
  isCustomOrder: boolean;
  details: CustomOrderDetails;
  onToggle: (value: boolean) => void;
  onDetailsChange: (details: CustomOrderDetails) => void;
}

export function CustomOrderToggle({
  isCustomOrder,
  details,
  onToggle,
  onDetailsChange,
}: CustomOrderToggleProps) {
  const toggleMethod = (method: string) => {
    const methods = details.methods.includes(method)
      ? details.methods.filter((m) => m !== method)
      : [...details.methods, method];
    onDetailsChange({ ...details, methods });
  };

  const toggleOptionType = (type: string) => {
    const optionTypes = details.optionTypes.includes(type)
      ? details.optionTypes.filter((t) => t !== type)
      : [...details.optionTypes, type];
    onDetailsChange({ ...details, optionTypes });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
        <Switch
          id="custom-order"
          checked={isCustomOrder}
          onCheckedChange={onToggle}
        />
        <Label htmlFor="custom-order" className="cursor-pointer font-medium">
          주문제작 상품
        </Label>
      </div>

      {isCustomOrder && (
        <div className="space-y-4 rounded-lg border bg-card p-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">제작 방식</Label>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_ORDER_METHODS.map((method) => (
                <Badge
                  key={method}
                  variant={
                    details.methods.includes(method) ? "default" : "outline"
                  }
                  className="cursor-pointer select-none transition-colors"
                  onClick={() => toggleMethod(method)}
                >
                  {method}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">커스텀 옵션 유형</Label>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_OPTION_TYPES.map((type) => (
                <Badge
                  key={type}
                  variant={
                    details.optionTypes.includes(type) ? "default" : "outline"
                  }
                  className="cursor-pointer select-none transition-colors"
                  onClick={() => toggleOptionType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

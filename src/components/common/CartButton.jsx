"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart,
  ShoppingBag
} from "lucide-react";

export default function CartButton({ 
  cartItemCount, 
  onClick, 
  className = "" 
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`relative ${className}`}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Cart
      {cartItemCount > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-medium bg-primary text-primary-foreground"
        >
          {cartItemCount > 99 ? '99+' : cartItemCount}
        </Badge>
      )}
    </Button>
  );
} 
"use client";

import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";

export default function PortalLink({ variant = "outline", size = "sm", className = "" }) {
  return (
    <Link href="/portal">
      <Button variant={variant} size={size} className={className}>
        <User className="w-4 h-4 mr-2" />
        Portal
      </Button>
    </Link>
  );
} 
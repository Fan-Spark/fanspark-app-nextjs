"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/data/collections";
import HomeComponent from "@/components/home/HomeComponent";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function CollectionPage() {
  const params = useParams();
  const collection = getCollectionBySlug(params.slug);

  if (!collection) {
    notFound();
  }

  // For now, we'll render the existing HomeComponent for the collection
  // This will be the campaigns/main view of the collection
  return (
    <ErrorBoundary>
      <HomeComponent collection={collection} />
    </ErrorBoundary>
  );
}

import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";

export function AuctionLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-10 w-80 rounded-lg mb-2" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-20 rounded mb-1" />
            <Skeleton className="h-8 w-32 rounded" />
            <Skeleton className="h-4 w-24 rounded mt-1" />
          </div>
        </div>
      </div>

      {/* Main Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Artwork and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Artwork Skeleton */}
          <Card>
            <CardBody className="p-0">
              <Skeleton className="aspect-square w-full rounded-lg" />
            </CardBody>
          </Card>

          {/* Description Skeleton */}
          <div>
            <Skeleton className="h-6 w-32 rounded mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          </div>

          {/* Artwork Details Skeleton */}
          <div>
            <Skeleton className="h-6 w-40 rounded mb-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 rounded mb-1" />
                  <Skeleton className="h-5 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Auction Controls and Info */}
        <div className="space-y-6">
          {/* Timer Skeleton */}
          <Card>
            <CardBody className="text-center py-6">
              <Skeleton className="h-8 w-32 rounded-full mx-auto mb-4" />
              <div className="grid grid-cols-4 gap-4 mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-14 w-full rounded-lg mb-1" />
                    <Skeleton className="h-3 w-12 rounded mx-auto" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-4 w-28 rounded mx-auto" />
            </CardBody>
          </Card>

          {/* Bidding Interface Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36 rounded" />
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <Skeleton className="h-4 w-20 rounded mb-1" />
                  <Skeleton className="h-6 w-24 rounded" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 rounded mb-1" />
                  <Skeleton className="h-6 w-28 rounded" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-16 rounded" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-16 rounded" />
                  ))}
                </div>
              </div>

              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </CardBody>
          </Card>

          {/* Artist Profile Skeleton */}
          <Card>
            <CardBody className="text-center">
              <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 rounded mx-auto mb-2" />
              <div className="space-y-1 mb-4">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded mx-auto" />
              </div>

              <div className="flex justify-center gap-4 mb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-5 h-5 rounded" />
                ))}
              </div>

              <div className="space-y-2">
                <Skeleton className="h-8 w-full rounded" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
            </CardBody>
          </Card>

          {/* Bid History Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28 rounded" />
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                  >
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 rounded mb-1" />
                      <Skeleton className="h-3 w-32 rounded" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 rounded mb-1" />
                      <Skeleton className="h-3 w-12 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function AuctionGridLoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardBody className="p-0">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="p-4">
              <div className="mb-3">
                <Skeleton className="h-5 w-3/4 rounded mb-1" />
                <Skeleton className="h-4 w-1/2 rounded" />
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <Skeleton className="h-3 w-16 rounded mb-1" />
                  <Skeleton className="h-5 w-20 rounded" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-3 w-8 rounded mb-1" />
                  <Skeleton className="h-5 w-6 rounded" />
                </div>
              </div>

              <Skeleton className="h-8 w-full rounded" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

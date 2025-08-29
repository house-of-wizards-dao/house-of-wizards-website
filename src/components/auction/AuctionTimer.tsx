import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { useAuctionTimer } from "@/hooks/useAuctionTimer";

interface AuctionTimerProps {
  end_time: string;
  start_time?: string;
  status: "upcoming" | "active" | "ended" | "cancelled";
  className?: string;
}

export function AuctionTimer({
  end_time,
  start_time,
  status,
  className,
}: AuctionTimerProps) {
  const timer = useAuctionTimer(end_time, start_time);

  const getStatusColor = () => {
    switch (status) {
      case "upcoming":
        return "warning";
      case "active":
        return timer.hasEnded ? "danger" : "success";
      case "ended":
        return "default";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    if (status === "cancelled") return "Cancelled";
    if (status === "upcoming") return "Upcoming";
    if (status === "ended" || timer.hasEnded) return "Ended";
    if (timer.isActive) return "Live Auction";
    return "Not Started";
  };

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  if (status === "cancelled" || status === "ended") {
    return (
      <Card className={className}>
        <CardBody className="text-center py-6">
          <Chip
            color={getStatusColor()}
            variant="flat"
            size="lg"
            className="mb-4"
          >
            {getStatusText()}
          </Chip>
          <p className="text-gray-400 text-sm">
            {status === "cancelled"
              ? "This auction has been cancelled"
              : "This auction has ended"}
          </p>
        </CardBody>
      </Card>
    );
  }

  if (status === "upcoming" && !timer.isActive) {
    return (
      <Card className={className}>
        <CardBody className="text-center py-6">
          <Chip color="warning" variant="flat" size="lg" className="mb-4">
            Upcoming
          </Chip>
          <p className="text-gray-400 text-sm">
            Auction starts on{" "}
            {new Date(start_time || end_time).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardBody className="text-center py-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Chip
            color={getStatusColor()}
            variant="flat"
            size="lg"
            className={timer.isActive && !timer.hasEnded ? "animate-pulse" : ""}
          >
            {getStatusText()}
          </Chip>
        </div>

        {timer.hasEnded ? (
          <p className="text-gray-400 text-sm">Auction has ended</p>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white bg-brand-500/20 rounded-lg py-3 px-2 mb-1">
                  {formatTime(timer.days)}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Days
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white bg-brand-500/20 rounded-lg py-3 px-2 mb-1">
                  {formatTime(timer.hours)}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Hours
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white bg-brand-500/20 rounded-lg py-3 px-2 mb-1">
                  {formatTime(timer.minutes)}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Minutes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white bg-brand-500/20 rounded-lg py-3 px-2 mb-1">
                  {formatTime(timer.seconds)}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Seconds
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              {timer.isActive ? "Time remaining" : "Time until start"}
            </p>
          </>
        )}
      </CardBody>
    </Card>
  );
}

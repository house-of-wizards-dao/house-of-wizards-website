import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Progress,
  Spinner,
} from "@nextui-org/react";
import { logger } from "@/lib/logger";
import type { AuctionStatsResponse } from "@/types/auction";

interface AuctionStatsProps {
  className?: string;
  refreshInterval?: number;
}

export default function AuctionStats({
  className,
  refreshInterval = 30000,
}: AuctionStatsProps) {
  const [stats, setStats] = useState<AuctionStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);

      const response = await fetch("/api/auctions/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch auction statistics");
      }

      const data: AuctionStatsResponse = await response.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch statistics",
      );
      logger.error(
        "Error fetching auction stats",
        err instanceof Error ? err : new Error(String(err)),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  if (loading && !stats) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${className}`}
      >
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`text-center text-gray-500 py-8 ${className}`}>
        No statistics available
      </div>
    );
  }

  const activePercentage =
    stats.total_auctions > 0
      ? (stats.active_auctions / stats.total_auctions) * 100
      : 0;

  return (
    <div className={className}>
      {lastUpdated && (
        <div className="text-sm text-gray-500 mb-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(stats.total_auctions)}
            </div>
            <div className="text-sm text-gray-500">Total Auctions</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(stats.active_auctions)}
            </div>
            <div className="text-sm text-gray-500">Active Auctions</div>
            <Progress
              value={activePercentage}
              color="success"
              className="mt-2"
              size="sm"
            />
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(stats.total_bids)}
            </div>
            <div className="text-sm text-gray-500">Total Bids</div>
            <div className="text-xs text-gray-400 mt-1">
              {stats.total_auctions > 0
                ? (stats.total_bids / stats.total_auctions).toFixed(1)
                : "0"}{" "}
              avg per auction
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.total_value)}
            </div>
            <div className="text-sm text-gray-500">Total Value</div>
            <div className="text-xs text-gray-400 mt-1">
              {formatCurrency(stats.avg_auction_value)} average
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Bidders */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Top Bidders</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          {stats.top_bidders.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No bidding activity yet
            </div>
          ) : (
            <Table removeWrapper aria-label="Top bidders table">
              <TableHeader>
                <TableColumn>Rank</TableColumn>
                <TableColumn>Bidder</TableColumn>
                <TableColumn>Total Bids</TableColumn>
                <TableColumn>Total Amount</TableColumn>
                <TableColumn>Activity Level</TableColumn>
              </TableHeader>
              <TableBody>
                {stats.top_bidders.map((bidder, index) => {
                  const activityLevel =
                    bidder.total_bids >= 20
                      ? "high"
                      : bidder.total_bids >= 10
                        ? "medium"
                        : "low";

                  const activityColor =
                    activityLevel === "high"
                      ? "success"
                      : activityLevel === "medium"
                        ? "warning"
                        : "default";

                  return (
                    <TableRow key={bidder.user_id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0
                                ? "bg-yellow-500 text-white"
                                : index === 1
                                  ? "bg-gray-400 text-white"
                                  : index === 2
                                    ? "bg-orange-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bidder.user_name}</div>
                          <div className="text-xs text-gray-500">
                            ID: {bidder.user_id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatNumber(bidder.total_bids)}</TableCell>
                      <TableCell>
                        {formatCurrency(bidder.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Chip color={activityColor} variant="flat" size="sm">
                          {activityLevel.toUpperCase()}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardBody>
            <h4 className="font-semibold mb-2">Auction Success Rate</h4>
            <div className="text-xl font-bold">
              {stats.total_auctions > 0
                ? (
                    ((stats.total_auctions - stats.active_auctions) /
                      stats.total_auctions) *
                    100
                  ).toFixed(1)
                : "0"}
              %
            </div>
            <div className="text-sm text-gray-500">Completed auctions</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h4 className="font-semibold mb-2">Bidding Activity</h4>
            <div className="text-xl font-bold">
              {stats.active_auctions > 0 && stats.total_bids > 0
                ? (stats.total_bids / stats.active_auctions).toFixed(1)
                : "0"}
            </div>
            <div className="text-sm text-gray-500">Bids per active auction</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h4 className="font-semibold mb-2">Market Activity</h4>
            <Chip
              color={
                stats.active_auctions > 5
                  ? "success"
                  : stats.active_auctions > 2
                    ? "warning"
                    : "danger"
              }
              variant="flat"
            >
              {stats.active_auctions > 5
                ? "High"
                : stats.active_auctions > 2
                  ? "Medium"
                  : "Low"}
            </Chip>
            <div className="text-sm text-gray-500 mt-2">
              Based on active auctions
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

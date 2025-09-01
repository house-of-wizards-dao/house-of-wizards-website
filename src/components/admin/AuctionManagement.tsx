import React, { useState, useCallback } from "react";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Spinner } from "@nextui-org/spinner";
import { Select, SelectItem } from "@nextui-org/select";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Textarea } from "@nextui-org/input";
import { Pagination } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { useAuctions } from "@/hooks/useAuctions";
import { logger } from "@/lib/logger";
import type { AuctionStatus } from "@/types/auction";

interface AuctionManagementProps {
  className?: string;
}

export default function AuctionManagement({
  className,
}: AuctionManagementProps) {
  const [selectedAuctions, setSelectedAuctions] = useState<string[]>([]);
  const [moderationAction, setModerationAction] = useState<string>("");
  const [moderationReason, setModerationReason] = useState("");
  const [extendMinutes, setExtendMinutes] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | "all">(
    "all",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch auctions with filters
  const {
    auctions,
    loading: fetchingAuctions,
    pagination,
    refetch,
  } = useAuctions({
    page: currentPage,
    limit: 20,
    sort_by: "created_at",
    sort_order: "desc",
    filters: statusFilter !== "all" ? { status: [statusFilter] } : undefined,
  });

  const handleSelectionChange = useCallback(
    (keys: "all" | Set<React.Key>) => {
      if (keys === "all") {
        setSelectedAuctions(auctions.map((auction) => auction.id));
      } else {
        setSelectedAuctions(Array.from(keys) as string[]);
      }
    },
    [auctions],
  );

  const handleSingleAction = useCallback(
    async (auctionId: string, action: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/auctions/moderate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auction_id: auctionId,
            action,
            reason: moderationReason,
            extend_minutes: action === "extend" ? extendMinutes : undefined,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to moderate auction");
        }

        await refetch();
        logger.info("Successfully moderated auction", { auctionId, action });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to moderate auction",
        );
        logger.error(
          "Error moderating auction",
          err instanceof Error ? err : new Error(String(err)),
        );
      } finally {
        setLoading(false);
      }
    },
    [moderationReason, extendMinutes, refetch],
  );

  const handleBulkAction = useCallback(async () => {
    if (selectedAuctions.length === 0 || !moderationAction) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/auctions/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auction_ids: selectedAuctions,
          action: moderationAction,
          reason: moderationReason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to perform bulk action");
      }

      const result = await response.json();
      const successful = result.results.filter((r: any) => r.success).length;
      const failed = result.results.filter((r: any) => !r.success).length;

      if (failed > 0) {
        setError(`${successful} actions succeeded, ${failed} failed`);
      }

      await refetch();
      setSelectedAuctions([]);
      onClose();

      logger.info("Bulk moderation completed", { successful, failed });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to perform bulk action",
      );
      logger.error(
        "Error in bulk moderation",
        err instanceof Error ? err : new Error(String(err)),
      );
    } finally {
      setLoading(false);
    }
  }, [selectedAuctions, moderationAction, moderationReason, refetch, onClose]);

  const getStatusColor = (
    status: AuctionStatus,
  ): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    switch (status) {
      case "active":
        return "success";
      case "ended":
        return "primary";
      case "cancelled":
        return "danger";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Auction Management</h2>

        <div className="flex flex-wrap gap-4 mb-4">
          <Select
            label="Filter by Status"
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setStatusFilter(e.target.value as AuctionStatus | "all")
            }
            className="max-w-xs"
          >
            <SelectItem key="all" value="all">
              All Statuses
            </SelectItem>
            <SelectItem key="draft" value="draft">
              Draft
            </SelectItem>
            <SelectItem key="active" value="active">
              Active
            </SelectItem>
            <SelectItem key="ended" value="ended">
              Ended
            </SelectItem>
            <SelectItem key="cancelled" value="cancelled">
              Cancelled
            </SelectItem>
          </Select>

          {selectedAuctions.length > 0 && (
            <Button color="primary" onPress={onOpen} isDisabled={loading}>
              Bulk Actions ({selectedAuctions.length})
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
      </div>

      {fetchingAuctions ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Table
            aria-label="Auction management table"
            selectionMode="multiple"
            selectedKeys={new Set(selectedAuctions)}
            onSelectionChange={handleSelectionChange}
            classNames={{
              wrapper: "min-h-[400px]",
            }}
          >
            <TableHeader>
              <TableColumn key="title">Title</TableColumn>
              <TableColumn key="artist">Artist</TableColumn>
              <TableColumn key="status">Status</TableColumn>
              <TableColumn key="current_bid">Current Bid</TableColumn>
              <TableColumn key="total_bids">Bids</TableColumn>
              <TableColumn key="end_time">End Time</TableColumn>
              <TableColumn key="featured">Featured</TableColumn>
              <TableColumn key="actions">Actions</TableColumn>
            </TableHeader>
            <TableBody items={auctions}>
              {(auction: any) => (
                <TableRow key={auction.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{auction.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {auction.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{auction.created_by_name || "Unknown"}</TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(auction.status)} variant="flat">
                      {auction.status.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatCurrency(auction.current_bid)}</TableCell>
                  <TableCell>{auction.total_bids}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatDate(auction.end_time)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={auction.featured ? "primary" : "default"}
                      variant="flat"
                      size="sm"
                    >
                      {auction.featured ? "Yes" : "No"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="light" size="sm" isDisabled={loading}>
                          Actions
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        onAction={(key: any) =>
                          handleSingleAction(auction.id, key as string)
                        }
                      >
                        <DropdownItem key="approve">Approve</DropdownItem>
                        <DropdownItem key="cancel">Cancel</DropdownItem>
                        <DropdownItem key="feature">
                          {auction.featured ? "Unfeature" : "Feature"}
                        </DropdownItem>
                        <DropdownItem key="extend">Extend Time</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {pagination.total > pagination.limit && (
            <div className="flex justify-center mt-6">
              <Pagination
                page={currentPage}
                total={Math.ceil(pagination.total / pagination.limit)}
                onChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Bulk Actions Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Bulk Actions ({selectedAuctions.length} auctions)
          </ModalHeader>
          <ModalBody>
            <Select
              label="Action"
              placeholder="Select an action"
              value={moderationAction}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setModerationAction(e.target.value)
              }
              isRequired
            >
              <SelectItem key="approve" value="approve">
                Approve Auctions
              </SelectItem>
              <SelectItem key="cancel" value="cancel">
                Cancel Auctions
              </SelectItem>
              <SelectItem key="feature" value="feature">
                Feature Auctions
              </SelectItem>
              <SelectItem key="unfeature" value="unfeature">
                Unfeature Auctions
              </SelectItem>
            </Select>

            <Textarea
              label="Reason (Optional)"
              placeholder="Provide a reason for this action..."
              value={moderationReason}
              onValueChange={setModerationReason}
              maxRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleBulkAction}
              isDisabled={!moderationAction || loading}
              isLoading={loading}
            >
              Apply Action
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

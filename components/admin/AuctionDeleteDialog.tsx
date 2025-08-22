import React, { useState } from "react";
import { AlertTriangle, Trash2, X, Gavel, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface AuctionData {
  id: string;
  title: string;
  description: string;
  artwork_url: string;
  artwork_thumbnail_url?: string;
  current_bid: number;
  starting_bid: number;
  status: 'upcoming' | 'active' | 'ended' | 'settled' | 'cancelled';
  creator_name: string;
  total_bids: number;
  watchers_count: number;
  end_time: string;
}

interface AuctionDeleteDialogProps {
  auction: AuctionData | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (auctionId: string, force: boolean) => Promise<void>;
  loading?: boolean;
}

export default function AuctionDeleteDialog({
  auction,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: AuctionDeleteDialogProps) {
  const [forceDelete, setForceDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !auction) return null;

  const hasActiveBids = auction.total_bids > 0;
  const isActiveAuction = auction.status === 'active';
  const requiresForce = isActiveAuction && hasActiveBids;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'upcoming': return 'text-blue-400';
      case 'ended': return 'text-gray-400';
      case 'settled': return 'text-purple-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDeleteAction = () => {
    if (requiresForce && !forceDelete) {
      return {
        title: 'Cannot Delete Active Auction',
        description: 'This auction has active bids and cannot be deleted. You can cancel it instead, or force delete if necessary.',
        actionText: 'Cancel Auction',
        isDestructive: false,
      };
    }

    if (forceDelete) {
      return {
        title: 'Permanently Delete Auction',
        description: 'This will permanently remove the auction and all associated data from the database. This action cannot be undone.',
        actionText: 'Permanently Delete',
        isDestructive: true,
      };
    }

    return {
      title: 'Cancel & Archive Auction',
      description: 'This will cancel the auction and move it to the archive. The auction can be restored later if needed.',
      actionText: 'Cancel & Archive',
      isDestructive: false,
    };
  };

  const handleConfirm = async () => {
    if (!auction) return;

    setIsDeleting(true);
    try {
      await onConfirm(auction.id, forceDelete);
      onClose();
    } catch (error) {
      console.error('Failed to delete auction:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteAction = getDeleteAction();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl border-red-600/30 bg-neutral-900">
        {/* Header */}
        <CardHeader className="border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-600/20 border border-red-600/30">
                {forceDelete ? (
                  <Trash2 size={20} className="text-red-400" />
                ) : (
                  <AlertTriangle size={20} className="text-yellow-400" />
                )}
              </div>
              <div>
                <CardTitle className="text-white">{deleteAction.title}</CardTitle>
                <p className="text-sm text-neutral-400 mt-1">
                  Are you sure you want to proceed?
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isDeleting}
            >
              <X size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Auction Preview */}
          <div className="flex space-x-4 p-4 rounded-lg bg-neutral-800/50 border border-neutral-700 mb-6">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-700 flex-shrink-0">
              {auction.artwork_url ? (
                <img
                  src={auction.artwork_thumbnail_url || auction.artwork_url}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500">
                  <Gavel size={24} />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{auction.title}</h3>
              <p className="text-sm text-neutral-400 mb-2">by {auction.creator_name}</p>
              
              <div className="flex items-center space-x-4 text-sm">
                <span className={cn("font-medium", getStatusColor(auction.status))}>
                  {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                </span>
                <span className="text-neutral-400">
                  Current: {auction.current_bid || auction.starting_bid} ETH
                </span>
                <span className="text-neutral-400 flex items-center gap-1">
                  <Gavel size={12} />
                  {auction.total_bids} bids
                </span>
                <span className="text-neutral-400 flex items-center gap-1">
                  <Users size={12} />
                  {auction.watchers_count} watching
                </span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className={cn(
            "p-4 rounded-lg border mb-6",
            forceDelete 
              ? "bg-red-900/20 border-red-600/30 text-red-200"
              : "bg-yellow-900/20 border-yellow-600/30 text-yellow-200"
          )}>
            <p className="text-sm leading-relaxed">
              {deleteAction.description}
            </p>
          </div>

          {/* Impact Summary */}
          {(hasActiveBids || auction.watchers_count > 0) && (
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-white">Impact Summary:</h4>
              <div className="space-y-2 text-sm">
                {hasActiveBids && (
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-800/50">
                    <span className="text-neutral-300">Active Bids</span>
                    <span className="text-red-400 font-medium">{auction.total_bids} affected</span>
                  </div>
                )}
                {auction.watchers_count > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-800/50">
                    <span className="text-neutral-300">Watchers</span>
                    <span className="text-yellow-400 font-medium">{auction.watchers_count} will be notified</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Force Delete Option */}
          {requiresForce && (
            <div className="p-4 rounded-lg bg-red-900/10 border border-red-600/20 mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceDelete}
                  onChange={(e) => setForceDelete(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-red-600 bg-transparent text-red-600 focus:ring-red-600 focus:ring-offset-0"
                />
                <div>
                  <span className="text-sm font-medium text-red-200">
                    Force permanent deletion
                  </span>
                  <p className="text-xs text-red-300 mt-1">
                    Check this box to permanently delete this auction despite having active bids. 
                    This action cannot be undone and may affect bidders.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Confirmation Note */}
          <div className="text-xs text-neutral-500 mb-6">
            {forceDelete ? (
              "⚠️ This is a permanent action that cannot be undone. All auction data will be lost."
            ) : (
              "ℹ️ Cancelled auctions can be restored from the archive if needed."
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-neutral-700 bg-neutral-900/50">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant={deleteAction.isDestructive ? "destructive" : "secondary"}
            onClick={handleConfirm}
            loading={isDeleting}
            disabled={loading || (requiresForce && !forceDelete)}
            leftIcon={forceDelete ? <Trash2 size={16} /> : <AlertTriangle size={16} />}
          >
            {deleteAction.actionText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
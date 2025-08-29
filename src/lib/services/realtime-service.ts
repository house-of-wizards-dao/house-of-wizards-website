import type { AuctionEvent, Auction, Bid } from "@/types/auction";
import { supabase } from "../supabase";
import { logger } from "../logger";

export type AuctionSubscriptionCallback = (event: AuctionEvent) => void;

export class RealtimeService {
  private subscriptions = new Map<string, any>();
  private callbacks = new Map<string, Set<AuctionSubscriptionCallback>>();

  // Subscribe to auction updates
  subscribeToAuction(
    auctionId: string,
    callback: AuctionSubscriptionCallback,
  ): () => void {
    const subscriptionKey = `auction:${auctionId}`;

    // Add callback to the set
    if (!this.callbacks.has(subscriptionKey)) {
      this.callbacks.set(subscriptionKey, new Set());
    }
    this.callbacks.get(subscriptionKey)!.add(callback);

    // Create subscription if it doesn't exist
    if (!this.subscriptions.has(subscriptionKey)) {
      this.createAuctionSubscription(auctionId);
    }

    // Return unsubscribe function
    return () => {
      this.unsubscribeFromAuction(auctionId, callback);
    };
  }

  // Unsubscribe from auction updates
  private unsubscribeFromAuction(
    auctionId: string,
    callback: AuctionSubscriptionCallback,
  ): void {
    const subscriptionKey = `auction:${auctionId}`;
    const callbackSet = this.callbacks.get(subscriptionKey);

    if (callbackSet) {
      callbackSet.delete(callback);

      // If no more callbacks, remove subscription
      if (callbackSet.size === 0) {
        this.callbacks.delete(subscriptionKey);
        const subscription = this.subscriptions.get(subscriptionKey);
        if (subscription) {
          subscription.unsubscribe();
          this.subscriptions.delete(subscriptionKey);
        }
      }
    }
  }

  // Subscribe to all auctions (for admin dashboard)
  subscribeToAllAuctions(callback: AuctionSubscriptionCallback): () => void {
    const subscriptionKey = "all-auctions";

    // Add callback
    if (!this.callbacks.has(subscriptionKey)) {
      this.callbacks.set(subscriptionKey, new Set());
    }
    this.callbacks.get(subscriptionKey)!.add(callback);

    // Create subscription if it doesn't exist
    if (!this.subscriptions.has(subscriptionKey)) {
      this.createAllAuctionsSubscription();
    }

    return () => {
      const callbackSet = this.callbacks.get(subscriptionKey);
      if (callbackSet) {
        callbackSet.delete(callback);
        if (callbackSet.size === 0) {
          this.callbacks.delete(subscriptionKey);
          const subscription = this.subscriptions.get(subscriptionKey);
          if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(subscriptionKey);
          }
        }
      }
    };
  }

  // Subscribe to user-specific auction updates (bids, watchlist)
  subscribeToUserAuctions(
    userId: string,
    callback: AuctionSubscriptionCallback,
  ): () => void {
    const subscriptionKey = `user:${userId}`;

    if (!this.callbacks.has(subscriptionKey)) {
      this.callbacks.set(subscriptionKey, new Set());
    }
    this.callbacks.get(subscriptionKey)!.add(callback);

    if (!this.subscriptions.has(subscriptionKey)) {
      this.createUserSubscription(userId);
    }

    return () => {
      const callbackSet = this.callbacks.get(subscriptionKey);
      if (callbackSet) {
        callbackSet.delete(callback);
        if (callbackSet.size === 0) {
          this.callbacks.delete(subscriptionKey);
          const subscription = this.subscriptions.get(subscriptionKey);
          if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(subscriptionKey);
          }
        }
      }
    };
  }

  // Broadcast event to specific auction subscribers
  async broadcastAuctionEvent(
    auctionId: string,
    event: AuctionEvent,
  ): Promise<void> {
    try {
      await supabase.channel(`auction:${auctionId}`).send({
        type: "broadcast",
        event: event.type,
        payload: event,
      });

      logger.info("Broadcasted auction event", {
        type: event.type,
        auctionId,
        timestamp: event.data.timestamp,
      });
    } catch (error) {
      logger.error("Error broadcasting auction event", error);
    }
  }

  // Create subscription for specific auction
  private createAuctionSubscription(auctionId: string): void {
    const subscriptionKey = `auction:${auctionId}`;

    const channel = supabase
      .channel(subscriptionKey)
      .on("broadcast", { event: "*" }, (payload) => {
        this.handleAuctionEvent(
          subscriptionKey,
          payload.payload as AuctionEvent,
        );
      })
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${auctionId}`,
        },
        (payload) => {
          this.handleAuctionUpdate(subscriptionKey, payload.new as Auction);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `auction_id=eq.${auctionId}`,
        },
        (payload) => {
          this.handleNewBid(subscriptionKey, payload.new as Bid);
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          logger.info("Subscribed to auction updates", { auctionId });
        } else if (status === "CHANNEL_ERROR") {
          logger.error("Error subscribing to auction", { auctionId });
        }
      });

    this.subscriptions.set(subscriptionKey, channel);
  }

  // Create subscription for all auctions (admin)
  private createAllAuctionsSubscription(): void {
    const subscriptionKey = "all-auctions";

    const channel = supabase
      .channel(subscriptionKey)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auctions",
        },
        (payload) => {
          this.handleAllAuctionsUpdate(payload);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
        },
        (payload) => {
          this.handleAllAuctionsBid(payload);
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          logger.info("Subscribed to all auction updates");
        }
      });

    this.subscriptions.set(subscriptionKey, channel);
  }

  // Create subscription for user-specific updates
  private createUserSubscription(userId: string): void {
    const subscriptionKey = `user:${userId}`;

    const channel = supabase
      .channel(subscriptionKey)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bids",
          filter: `bidder_id=eq.${userId}`,
        },
        (payload) => {
          this.handleUserBidUpdate(subscriptionKey, payload);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "watchlist",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          this.handleUserWatchlistUpdate(subscriptionKey, payload);
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          logger.info("Subscribed to user updates", { userId });
        }
      });

    this.subscriptions.set(subscriptionKey, channel);
  }

  // Event handlers
  private handleAuctionEvent(
    subscriptionKey: string,
    event: AuctionEvent,
  ): void {
    const callbacks = this.callbacks.get(subscriptionKey);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          logger.error("Error in auction event callback", error);
        }
      });
    }
  }

  private handleAuctionUpdate(subscriptionKey: string, auction: Auction): void {
    const event: AuctionEvent = {
      type: "auction_started", // This could be more specific based on the change
      auction_id: auction.id,
      data: {
        auction: auction,
        timestamp: new Date().toISOString(),
      },
    };

    this.handleAuctionEvent(subscriptionKey, event);
  }

  private handleNewBid(subscriptionKey: string, bid: Bid): void {
    const event: AuctionEvent = {
      type: "bid_placed",
      auction_id: bid.auction_id,
      data: {
        bid: bid,
        timestamp: bid.placed_at,
      },
    };

    this.handleAuctionEvent(subscriptionKey, event);
  }

  private handleAllAuctionsUpdate(payload: any): void {
    const event: AuctionEvent = {
      type:
        payload.eventType === "INSERT" ? "auction_started" : "auction_started",
      auction_id: payload.new?.id || payload.old?.id,
      data: {
        auction: payload.new,
        timestamp: new Date().toISOString(),
      },
    };

    this.handleAuctionEvent("all-auctions", event);
  }

  private handleAllAuctionsBid(payload: any): void {
    const bid = payload.new as Bid;
    const event: AuctionEvent = {
      type: "bid_placed",
      auction_id: bid.auction_id,
      data: {
        bid: bid,
        timestamp: bid.placed_at,
      },
    };

    this.handleAuctionEvent("all-auctions", event);
  }

  private handleUserBidUpdate(subscriptionKey: string, payload: any): void {
    const bid = payload.new as Bid;
    const eventType =
      payload.eventType === "UPDATE"
        ? bid.status === "outbid"
          ? "bid_outbid"
          : "bid_placed"
        : "bid_placed";

    const event: AuctionEvent = {
      type: eventType as any,
      auction_id: bid.auction_id,
      data: {
        bid: bid,
        timestamp: bid.placed_at,
      },
    };

    this.handleAuctionEvent(subscriptionKey, event);
  }

  private handleUserWatchlistUpdate(
    subscriptionKey: string,
    payload: any,
  ): void {
    // Handle watchlist changes - could trigger notifications
    logger.info("User watchlist updated", { payload });
  }

  // Cleanup all subscriptions
  cleanup(): void {
    this.subscriptions.forEach((subscription, key) => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        logger.error("Error unsubscribing from channel", { key, error });
      }
    });

    this.subscriptions.clear();
    this.callbacks.clear();

    logger.info("Cleaned up all realtime subscriptions");
  }
}

// Singleton instance
export const realtimeService = new RealtimeService();

// Auto-cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    realtimeService.cleanup();
  });
}

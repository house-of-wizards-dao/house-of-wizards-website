// Tests for the auction timing synchronization fix
// This test verifies that auctions no longer show "ended" immediately after creation

import { 
  getBlockchainTime, 
  calculateAuctionEndTime, 
  canAcceptBids, 
  formatAuctionDuration,
  AUCTION_SAFETY_BUFFER_SECONDS,
  BlockchainTimeResult
} from '../lib/blockchain-time';

// Mock the logger
jest.mock('../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }
}));

describe('Auction Timing Fix Implementation', () => {
  const mockPublicClient = {
    getBlock: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getBlockchainTime', () => {
    it('should fetch accurate blockchain time from the latest block', async () => {
      const mockBlockTimestamp = Math.floor(Date.now() / 1000);
      const mockBlockNumber = BigInt(12345);
      
      mockPublicClient.getBlock.mockResolvedValue({
        timestamp: BigInt(mockBlockTimestamp),
        number: mockBlockNumber,
      });

      const result = await getBlockchainTime(mockPublicClient);

      expect(result.timestamp).toBe(mockBlockTimestamp);
      expect(result.blockNumber).toBe(mockBlockNumber);
      expect(result.isAccurate).toBe(true);
    });

    it('should fallback to local time when blockchain fetch fails', async () => {
      mockPublicClient.getBlock.mockRejectedValue(new Error('Network error'));

      const beforeTime = Math.floor(Date.now() / 1000);
      const result = await getBlockchainTime(mockPublicClient);
      const afterTime = Math.floor(Date.now() / 1000);

      expect(result.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(result.timestamp).toBeLessThanOrEqual(afterTime);
      expect(result.isAccurate).toBe(false);
    });

    it('should fallback to local time when no public client is provided', async () => {
      const beforeTime = Math.floor(Date.now() / 1000);
      const result = await getBlockchainTime();
      const afterTime = Math.floor(Date.now() / 1000);

      expect(result.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(result.timestamp).toBeLessThanOrEqual(afterTime);
      expect(result.isAccurate).toBe(false);
    });
  });

  describe('calculateAuctionEndTime', () => {
    it('should add safety buffer by default', () => {
      const startTimestamp = 1000000000; // Example timestamp
      const durationHours = 24;

      const result = calculateAuctionEndTime(startTimestamp, durationHours, true);

      expect(result.userEndTime).toBe(startTimestamp + (24 * 3600));
      expect(result.actualEndTime).toBe(startTimestamp + (24 * 3600) + AUCTION_SAFETY_BUFFER_SECONDS);
      expect(result.bufferSeconds).toBe(AUCTION_SAFETY_BUFFER_SECONDS);
    });

    it('should not add buffer when disabled', () => {
      const startTimestamp = 1000000000;
      const durationHours = 1;

      const result = calculateAuctionEndTime(startTimestamp, durationHours, false);

      expect(result.userEndTime).toBe(startTimestamp + 3600);
      expect(result.actualEndTime).toBe(startTimestamp + 3600);
      expect(result.bufferSeconds).toBe(0);
    });

    it('should handle fractional hours correctly', () => {
      const startTimestamp = 1000000000;
      const durationHours = 0.5; // 30 minutes

      const result = calculateAuctionEndTime(startTimestamp, durationHours, true);

      expect(result.userEndTime).toBe(startTimestamp + 1800); // 30 minutes
      expect(result.actualEndTime).toBe(startTimestamp + 1800 + AUCTION_SAFETY_BUFFER_SECONDS);
    });
  });

  describe('canAcceptBids', () => {
    it('should allow bids when auction has time remaining', () => {
      const auctionEndTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const blockchainTime: BlockchainTimeResult = {
        timestamp: Math.floor(Date.now() / 1000),
        blockNumber: BigInt(12345),
        isAccurate: true,
      };

      const result = canAcceptBids(auctionEndTime, blockchainTime);

      expect(result.canBid).toBe(true);
      expect(result.timeRemaining).toBeGreaterThan(3500); // Should have ~3570 seconds (1 hour - 30 second grace)
    });

    it('should reject bids when auction has ended', () => {
      const auctionEndTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const blockchainTime: BlockchainTimeResult = {
        timestamp: Math.floor(Date.now() / 1000),
        blockNumber: BigInt(12345),
        isAccurate: true,
      };

      const result = canAcceptBids(auctionEndTime, blockchainTime);

      expect(result.canBid).toBe(false);
      expect(result.timeRemaining).toBeLessThan(0);
      expect(result.reason).toContain('ended');
    });

    it('should account for grace period correctly', () => {
      const gracePeriodSeconds = 60;
      const auctionEndTime = Math.floor(Date.now() / 1000) + 30; // 30 seconds from now
      const blockchainTime: BlockchainTimeResult = {
        timestamp: Math.floor(Date.now() / 1000),
        blockNumber: BigInt(12345),
        isAccurate: true,
      };

      const result = canAcceptBids(auctionEndTime, blockchainTime, gracePeriodSeconds);

      // Should reject because 30 seconds < 60 second grace period
      expect(result.canBid).toBe(false);
    });

    it('should provide different reason text for inaccurate blockchain time', () => {
      const auctionEndTime = Math.floor(Date.now() / 1000) - 100;
      const blockchainTime: BlockchainTimeResult = {
        timestamp: Math.floor(Date.now() / 1000),
        blockNumber: BigInt(0),
        isAccurate: false,
      };

      const result = canAcceptBids(auctionEndTime, blockchainTime);

      expect(result.canBid).toBe(false);
      expect(result.reason).toContain('local time');
      expect(result.reason).toContain('blockchain time unavailable');
    });
  });

  describe('formatAuctionDuration', () => {
    it('should format remaining time correctly for days', () => {
      const currentTime = 1000000000;
      const userEndTime = currentTime + (2 * 24 * 3600) + (5 * 3600) + (30 * 60); // 2d 5h 30m
      const actualEndTime = userEndTime + AUCTION_SAFETY_BUFFER_SECONDS;

      const result = formatAuctionDuration(userEndTime, actualEndTime, currentTime);

      expect(result.userDisplay).toBe('2d 5h 30m');
      expect(result.hasBuffer).toBe(true);
      expect(result.actualRemaining).toBe((2 * 24 * 3600) + (5 * 3600) + (30 * 60) + AUCTION_SAFETY_BUFFER_SECONDS);
    });

    it('should format remaining time correctly for hours', () => {
      const currentTime = 1000000000;
      const userEndTime = currentTime + (3 * 3600) + (45 * 60) + 30; // 3h 45m 30s
      const actualEndTime = userEndTime + AUCTION_SAFETY_BUFFER_SECONDS;

      const result = formatAuctionDuration(userEndTime, actualEndTime, currentTime);

      expect(result.userDisplay).toBe('3h 45m 30s');
      expect(result.hasBuffer).toBe(true);
    });

    it('should format remaining time correctly for minutes', () => {
      const currentTime = 1000000000;
      const userEndTime = currentTime + (15 * 60) + 45; // 15m 45s
      const actualEndTime = userEndTime + AUCTION_SAFETY_BUFFER_SECONDS;

      const result = formatAuctionDuration(userEndTime, actualEndTime, currentTime);

      expect(result.userDisplay).toBe('15m 45s');
      expect(result.hasBuffer).toBe(true);
    });

    it('should show "Auction Ended" when user time has passed', () => {
      const currentTime = 1000000000;
      const userEndTime = currentTime - 100; // 100 seconds ago
      const actualEndTime = userEndTime + AUCTION_SAFETY_BUFFER_SECONDS; // Still might have buffer time

      const result = formatAuctionDuration(userEndTime, actualEndTime, currentTime);

      expect(result.userDisplay).toBe('Auction Ended');
      expect(result.actualRemaining).toBe(AUCTION_SAFETY_BUFFER_SECONDS - 100); // Buffer minus elapsed
    });

    it('should detect when no buffer is applied', () => {
      const currentTime = 1000000000;
      const userEndTime = currentTime + 3600;
      const actualEndTime = userEndTime; // Same as user end time, no buffer

      const result = formatAuctionDuration(userEndTime, actualEndTime, currentTime);

      expect(result.hasBuffer).toBe(false);
      expect(result.actualRemaining).toBe(3600);
    });
  });

  describe('Integration Test: Complete Auction Creation Flow', () => {
    it('should prevent "auction ended" error immediately after creation', async () => {
      // Simulate the auction creation process
      const mockCurrentBlockchainTime = Math.floor(Date.now() / 1000);
      
      mockPublicClient.getBlock.mockResolvedValue({
        timestamp: BigInt(mockCurrentBlockchainTime),
        number: BigInt(12345),
      });

      // 1. Get blockchain time (as in auction creation)
      const blockchainTimeResult = await getBlockchainTime(mockPublicClient);
      
      // 2. Calculate auction end times (as in auction creation)
      const durationHours = 1; // 1 hour auction
      const endTimes = calculateAuctionEndTime(blockchainTimeResult.timestamp, durationHours, true);
      
      // 3. Verify that bids can be accepted immediately after creation
      const bidValidation = canAcceptBids(endTimes.actualEndTime, blockchainTimeResult);
      
      // The key test: auction should accept bids immediately after creation
      expect(bidValidation.canBid).toBe(true);
      expect(bidValidation.timeRemaining).toBeGreaterThan(3500); // Should have ~3570 seconds (1 hour + buffer - grace)
      
      // 4. Verify user sees the correct duration (without buffer)
      const durationDisplay = formatAuctionDuration(
        endTimes.userEndTime, 
        endTimes.actualEndTime, 
        blockchainTimeResult.timestamp
      );
      
      expect(durationDisplay.userDisplay).toBe('1h 0m 0s');
      expect(durationDisplay.hasBuffer).toBe(true);
      expect(durationDisplay.actualRemaining).toBe(3600 + AUCTION_SAFETY_BUFFER_SECONDS);
    });

    it('should handle the case where local time is used as fallback', async () => {
      // Simulate blockchain time fetch failure
      mockPublicClient.getBlock.mockRejectedValue(new Error('RPC error'));
      
      const blockchainTimeResult = await getBlockchainTime(mockPublicClient);
      expect(blockchainTimeResult.isAccurate).toBe(false);
      
      // Even with fallback time, the buffer should prevent immediate "ended" status
      const durationHours = 1;
      const endTimes = calculateAuctionEndTime(blockchainTimeResult.timestamp, durationHours, true);
      
      const bidValidation = canAcceptBids(endTimes.actualEndTime, blockchainTimeResult);
      
      expect(bidValidation.canBid).toBe(true);
      expect(bidValidation.timeRemaining).toBeGreaterThan(3500);
    });

    it('should handle edge case of very short auctions', async () => {
      const mockCurrentBlockchainTime = Math.floor(Date.now() / 1000);
      
      mockPublicClient.getBlock.mockResolvedValue({
        timestamp: BigInt(mockCurrentBlockchainTime),
        number: BigInt(12345),
      });

      const blockchainTimeResult = await getBlockchainTime(mockPublicClient);
      
      // Create a very short auction (5 minutes)
      const durationHours = 5 / 60; // 5 minutes
      const endTimes = calculateAuctionEndTime(blockchainTimeResult.timestamp, durationHours, true);
      
      // Even with short duration, buffer should make it work
      const bidValidation = canAcceptBids(endTimes.actualEndTime, blockchainTimeResult);
      
      expect(bidValidation.canBid).toBe(true);
      expect(endTimes.bufferSeconds).toBe(AUCTION_SAFETY_BUFFER_SECONDS);
      expect(endTimes.actualEndTime - endTimes.userEndTime).toBe(AUCTION_SAFETY_BUFFER_SECONDS);
    });
  });
});
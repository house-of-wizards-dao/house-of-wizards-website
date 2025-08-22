-- Script to clear on-chain auction ID for stuck auctions
-- This allows the system to create a new on-chain auction when the old one has ended

-- Clear the on_chain_auction_id for a specific auction
-- Replace 'e25834f7-a599-49d3-8df1-da8c98416153' with your auction ID
UPDATE auctions 
SET on_chain_auction_id = NULL,
    updated_at = NOW()
WHERE id = 'e25834f7-a599-49d3-8df1-da8c98416153';

-- Optional: Clear all auctions with on_chain_auction_id = 8 (the stuck one)
-- UPDATE auctions 
-- SET on_chain_auction_id = NULL,
--     updated_at = NOW()
-- WHERE on_chain_auction_id = 8;

-- To see which auctions are affected:
SELECT id, title, on_chain_auction_id, status, end_time 
FROM auctions 
WHERE on_chain_auction_id = 8 
   OR id = 'e25834f7-a599-49d3-8df1-da8c98416153';
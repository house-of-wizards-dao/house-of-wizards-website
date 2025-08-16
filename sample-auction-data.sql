-- Sample auction data for testing
-- Run this AFTER creating the auction tables
-- Make sure you have at least one user profile in your database first

-- Insert sample auctions (you'll need to replace the creator_id with an actual user ID from your profiles table)
INSERT INTO auctions (
    creator_id, 
    title, 
    description, 
    artwork_url, 
    artwork_thumbnail_url,
    starting_bid, 
    minimum_increment, 
    end_time, 
    status,
    category
) VALUES 
(
    (SELECT id FROM profiles LIMIT 1), -- Use first available user
    'Mystical Forest Spirit',
    'A beautiful digital artwork depicting an ethereal forest spirit dancing among ancient trees. This piece captures the magic and mystery of nature through vibrant colors and flowing forms.',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    0.1,
    0.01,
    NOW() + INTERVAL '7 days',
    'active',
    'Digital Art'
),
(
    (SELECT id FROM profiles LIMIT 1),
    'Cosmic Wanderer',
    'An abstract piece exploring the vastness of space and our place within it. Swirling galaxies and nebulae create a sense of wonder and exploration.',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400',
    0.25,
    0.05,
    NOW() + INTERVAL '3 days',
    'active',
    'Abstract'
),
(
    (SELECT id FROM profiles LIMIT 1),
    'Urban Dreams',
    'A stunning piece that captures the energy and rhythm of city life. Neon lights and architectural forms blend to create a modern masterpiece.',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
    0.15,
    0.02,
    NOW() + INTERVAL '5 days',
    'upcoming',
    'Photography'
),
(
    (SELECT id FROM profiles LIMIT 1),
    'Ethereal Bloom',
    'A delicate watercolor-inspired digital piece featuring blooming flowers in soft, dreamy tones. Perfect for collectors who appreciate subtle beauty.',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    0.08,
    0.01,
    NOW() - INTERVAL '1 day',
    'ended',
    'Nature'
);

-- Insert some sample bids for the active auctions
INSERT INTO bids (auction_id, bidder_id, amount, is_winning) VALUES
(
    (SELECT id FROM auctions WHERE title = 'Mystical Forest Spirit'),
    (SELECT id FROM profiles LIMIT 1),
    0.12,
    true
),
(
    (SELECT id FROM auctions WHERE title = 'Cosmic Wanderer'),
    (SELECT id FROM profiles LIMIT 1),
    0.30,
    true
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'SUCCESS: Sample auction data created! Visit /auctions to see them.';
END $$;
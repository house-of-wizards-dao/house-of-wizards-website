// Read the file and replace the transformation section
const fs = require('fs');

let content = fs.readFileSync('/Users/pleasures/Desktop/how-dao-revamp/pages/api/admin/auctions.ts', 'utf8');

// Replace the problematic transformation section
const oldTransformation = `    // Transform data to include computed fields
    const transformedAuctions: AuctionWithDetails[] = (auctions || []).map((auction: any) => ({
      ...auction,
      creator_name: auction.profiles?.name || 'Unknown Creator',
      creator_avatar: auction.profiles?.avatar_url,
      total_bids: auction.bids?.[0]?.count || 0,
      watchers_count: auction.auction_watchers?.[0]?.count || 0,
    }));`;

const newTransformation = `    // Fetch creator information separately to avoid foreign key issues
    const creatorIds = [...new Set((auctions || []).map((auction: any) => auction.creator_id))].filter(Boolean);
    let profilesMap: Record<string, any> = {};
    
    if (creatorIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', creatorIds);

      // Create a map for quick lookup
      profilesMap = (profiles || []).reduce((acc: Record<string, any>, profile: any) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
    }

    // Get bid counts for each auction
    const auctionIds = (auctions || []).map((auction: any) => auction.id);
    let bidCountMap: Record<string, number> = {};
    
    if (auctionIds.length > 0) {
      const { data: bidCounts } = await supabase
        .from('bids')
        .select('auction_id')
        .in('auction_id', auctionIds);

      bidCountMap = (bidCounts || []).reduce((acc: Record<string, number>, bid: any) => {
        acc[bid.auction_id] = (acc[bid.auction_id] || 0) + 1;
        return acc;
      }, {});
    }

    // Transform data to include computed fields
    const transformedAuctions: AuctionWithDetails[] = (auctions || []).map((auction: any) => ({
      ...auction,
      creator_name: profilesMap[auction.creator_id]?.name || 'Unknown Creator',
      creator_avatar: profilesMap[auction.creator_id]?.avatar_url,
      total_bids: bidCountMap[auction.id] || 0,
      watchers_count: 0, // TODO: Implement auction watchers count if needed
    }));`;

content = content.replace(oldTransformation, newTransformation);
fs.writeFileSync('/Users/pleasures/Desktop/how-dao-revamp/pages/api/admin/auctions.ts', content);
console.log('File updated successfully');

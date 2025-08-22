import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye, 
  Calendar, 
  DollarSign,
  Gavel,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

import DefaultLayout from "@/layouts/default";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageErrorBoundary from "@/components/PageErrorBoundary";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import AuctionEditModal from "@/components/admin/AuctionEditModal";
import AuctionDeleteDialog from "@/components/admin/AuctionDeleteDialog";
import { cn } from "@/lib/utils";

interface AuctionData {
  id: string;
  title: string;
  description: string;
  artwork_url: string;
  artwork_thumbnail_url?: string;
  starting_bid: number;
  current_bid: number;
  minimum_increment: number;
  reserve_price?: number;
  start_time: string;
  end_time: string;
  time_buffer_seconds: number;
  status: 'upcoming' | 'active' | 'ended' | 'settled' | 'cancelled';
  category: string;
  tags: string[];
  creator_id: string;
  creator_name: string;
  creator_avatar?: string;
  total_bids: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
}

interface Filters {
  search: string;
  status: string;
  category: string;
  creator_id: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'active', label: 'Active' },
  { value: 'ended', label: 'Ended' },
  { value: 'settled', label: 'Settled' },
  { value: 'cancelled', label: 'Cancelled' },
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'art', label: 'Art' },
  { value: 'photography', label: 'Photography' },
  { value: 'digital', label: 'Digital' },
  { value: 'collectible', label: 'Collectible' },
  { value: 'nft', label: 'NFT' },
  { value: 'rare', label: 'Rare' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'other', label: 'Other' },
];

const ITEMS_PER_PAGE = 20;

export default function AuctionManagementPage() {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  
  // Authorization check
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data state
  const [auctions, setAuctions] = useState<AuctionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and pagination state
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    category: '',
    creator_id: '',
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  
  // Modal state
  const [editingAuction, setEditingAuction] = useState<AuctionData | null>(null);
  const [deletingAuction, setDeletingAuction] = useState<AuctionData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Authorization check
  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          setIsAuthorized(true);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [user, router, supabase]);

  // Fetch auctions
  const fetchAuctions = useCallback(async () => {
    if (!isAuthorized) return;

    setLoading(true);
    setError(null);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('No access token');
      }

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort_by: 'created_at',
        sort_order: 'desc',
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.creator_id) params.append('creator_id', filters.creator_id);

      const response = await fetch(`/api/admin/auctions?${params}`, {
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch auctions');
      }

      const { data, meta } = await response.json();
      setAuctions(data);
      setPagination(prev => ({
        ...prev,
        total: meta.total,
        totalPages: meta.totalPages,
        hasMore: meta.hasMore,
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to load auctions');
      console.error('Error fetching auctions:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase, isAuthorized, filters, pagination.page, pagination.limit]);

  // Fetch auctions when dependencies change
  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  // Handle auction update
  const handleUpdateAuction = useCallback(async (auctionId: string, updateData: Partial<AuctionData>) => {
    setActionLoading(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('No access token');
      }

      const response = await fetch(`/api/admin/auctions?id=${auctionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update auction');
      }

      // Refresh the auctions list
      await fetchAuctions();
      setEditingAuction(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update auction');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [supabase, fetchAuctions]);

  // Handle auction deletion
  const handleDeleteAuction = useCallback(async (auctionId: string, force: boolean = false) => {
    setActionLoading(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('No access token');
      }

      const response = await fetch(`/api/admin/auctions?id=${auctionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete auction');
      }

      // Refresh the auctions list
      await fetchAuctions();
      setDeletingAuction(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete auction');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [supabase, fetchAuctions]);

  // Format helpers
  const formatPrice = (price: number) => `${price} ETH`;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-600/20 text-green-400 border border-green-600/30`;
      case 'upcoming':
        return `${baseClasses} bg-blue-600/20 text-blue-400 border border-blue-600/30`;
      case 'ended':
        return `${baseClasses} bg-gray-600/20 text-gray-400 border border-gray-600/30`;
      case 'settled':
        return `${baseClasses} bg-purple-600/20 text-purple-400 border border-purple-600/30`;
      case 'cancelled':
        return `${baseClasses} bg-red-600/20 text-red-400 border border-red-600/30`;
      default:
        return `${baseClasses} bg-gray-600/20 text-gray-400 border border-gray-600/30`;
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Loading states
  if (isLoading) {
    return (
      <DefaultLayout>
        <LoadingSpinner fullScreen message="Checking authorization..." />
      </DefaultLayout>
    );
  }

  if (!isAuthorized) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-400">Redirecting to login...</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <PageErrorBoundary pageTitle="Auction Management" showHomeButton={false}>
        <div className="mx-auto py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-atirose text-violet text-4xl md:text-5xl mb-2">
                    Auction Management
                  </h1>
                  <p className="text-gray-400">
                    Manage auctions, update details, and monitor activity
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={fetchAuctions}
                  loading={loading}
                  leftIcon={<RefreshCw size={16} />}
                >
                  Refresh
                </Button>
              </div>

              {/* Filters */}
              <Card variant="outlined" className="mb-6">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      placeholder="Search auctions..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      leftIcon={<Search size={16} />}
                    />
                    
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="h-10 px-3 rounded-lg border border-neutral-700 bg-transparent text-white focus:border-violet focus:ring-2 focus:ring-violet focus:ring-offset-2 focus:ring-offset-neutral-900"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-neutral-800">
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="h-10 px-3 rounded-lg border border-neutral-700 bg-transparent text-white focus:border-violet focus:ring-2 focus:ring-violet focus:ring-offset-2 focus:ring-offset-neutral-900"
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-neutral-800">
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>Total: {pagination.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-xl text-red-200">
                {error}
                <Button
                  variant="ghost"
                  size="sm"
                  className="float-right"
                  onClick={() => setError(null)}
                >
                  ×
                </Button>
              </div>
            )}

            {/* Auctions Table */}
            <Card variant="outlined">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel size={20} />
                  Auctions ({pagination.total})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner message="Loading auctions..." />
                  </div>
                ) : auctions.length === 0 ? (
                  <div className="text-center py-12">
                    <Gavel size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg text-gray-400 mb-2">No auctions found</h3>
                    <p className="text-gray-500">
                      {filters.search || filters.status !== 'all' || filters.category
                        ? 'Try adjusting your filters'
                        : 'No auctions have been created yet'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-neutral-700">
                        <tr className="text-left">
                          <th className="p-4 font-medium text-gray-300">Auction</th>
                          <th className="p-4 font-medium text-gray-300">Status</th>
                          <th className="p-4 font-medium text-gray-300">Pricing</th>
                          <th className="p-4 font-medium text-gray-300">Activity</th>
                          <th className="p-4 font-medium text-gray-300">Timing</th>
                          <th className="p-4 font-medium text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auctions.map((auction) => (
                          <tr
                            key={auction.id}
                            className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                          >
                            {/* Auction Info */}
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-700 flex-shrink-0">
                                  {auction.artwork_url ? (
                                    <img
                                      src={auction.artwork_thumbnail_url || auction.artwork_url}
                                      alt={auction.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                      <Gavel size={16} />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-medium text-white truncate">
                                    {auction.title}
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    by {auction.creator_name}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-500 bg-neutral-800 px-2 py-1 rounded">
                                      {auction.category}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="p-4">
                              <span className={getStatusBadge(auction.status)}>
                                {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                              </span>
                            </td>

                            {/* Pricing */}
                            <td className="p-4">
                              <div className="text-sm">
                                <div className="flex items-center gap-1 text-violet font-medium">
                                  <DollarSign size={12} />
                                  {formatPrice(auction.current_bid || auction.starting_bid)}
                                </div>
                                <div className="text-gray-400">
                                  Start: {formatPrice(auction.starting_bid)}
                                </div>
                                {auction.reserve_price && (
                                  <div className="text-gray-500 text-xs">
                                    Reserve: {formatPrice(auction.reserve_price)}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Activity */}
                            <td className="p-4">
                              <div className="text-sm space-y-1">
                                <div className="flex items-center gap-1 text-gray-300">
                                  <Gavel size={12} />
                                  {auction.total_bids} bids
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Users size={12} />
                                  {auction.watchers_count} watching
                                </div>
                              </div>
                            </td>

                            {/* Timing */}
                            <td className="p-4">
                              <div className="text-sm">
                                {auction.status === 'active' && (
                                  <div className="flex items-center gap-1 text-green-400 font-medium">
                                    <Clock size={12} />
                                    {getTimeRemaining(auction.end_time)}
                                  </div>
                                )}
                                <div className="text-gray-400">
                                  Ends: {formatDate(auction.end_time)}
                                </div>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingAuction(auction)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Edit2 size={16} />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeletingAuction(auction)}
                                  className="text-gray-400 hover:text-red-400"
                                >
                                  <Trash2 size={16} />
                                </Button>

                                <Link href={`/auctions/${auction.id}`} target="_blank">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <ExternalLink size={16} />
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {!loading && auctions.length > 0 && (
                  <div className="flex items-center justify-between p-4 border-t border-neutral-700">
                    <div className="text-sm text-gray-400">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} auctions
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        leftIcon={<ChevronLeft size={16} />}
                      >
                        Previous
                      </Button>
                      
                      <span className="text-sm text-gray-400">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasMore}
                        rightIcon={<ChevronRight size={16} />}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Modal */}
        <AuctionEditModal
          auction={editingAuction}
          isOpen={!!editingAuction}
          onClose={() => setEditingAuction(null)}
          onSave={handleUpdateAuction}
          loading={actionLoading}
        />

        {/* Delete Dialog */}
        <AuctionDeleteDialog
          auction={deletingAuction}
          isOpen={!!deletingAuction}
          onClose={() => setDeletingAuction(null)}
          onConfirm={handleDeleteAuction}
          loading={actionLoading}
        />
      </PageErrorBoundary>
    </DefaultLayout>
  );
}
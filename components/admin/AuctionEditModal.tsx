import React, { useState, useEffect, useCallback } from "react";
import { X, Calendar, DollarSign, Clock, Tag, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
  creator_name: string;
  total_bids: number;
  watchers_count: number;
  updated_at: string;
}

interface AuctionEditModalProps {
  auction: AuctionData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (auctionId: string, updateData: Partial<AuctionData>) => Promise<void>;
  loading?: boolean;
}

interface FormData {
  title: string;
  description: string;
  starting_bid: string;
  reserve_price: string;
  minimum_increment: string;
  start_time: string;
  end_time: string;
  time_buffer_seconds: string;
  category: string;
  tags: string;
  status: 'upcoming' | 'active' | 'ended' | 'settled' | 'cancelled';
}

const statusOptions = [
  { value: 'upcoming', label: 'Upcoming', description: 'Auction not yet started' },
  { value: 'active', label: 'Active', description: 'Currently accepting bids' },
  { value: 'ended', label: 'Ended', description: 'Bidding has ended' },
  { value: 'settled', label: 'Settled', description: 'Payment completed' },
  { value: 'cancelled', label: 'Cancelled', description: 'Auction was cancelled' },
] as const;

const categoryOptions = [
  'art', 'photography', 'digital', 'collectible', 'nft', 'rare', 'vintage', 'other'
];

export default function AuctionEditModal({ 
  auction, 
  isOpen, 
  onClose, 
  onSave, 
  loading = false 
}: AuctionEditModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    starting_bid: '',
    reserve_price: '',
    minimum_increment: '',
    start_time: '',
    end_time: '',
    time_buffer_seconds: '',
    category: 'art',
    tags: '',
    status: 'upcoming',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when auction data changes
  useEffect(() => {
    if (auction) {
      setFormData({
        title: auction.title || '',
        description: auction.description || '',
        starting_bid: auction.starting_bid?.toString() || '',
        reserve_price: auction.reserve_price?.toString() || '',
        minimum_increment: auction.minimum_increment?.toString() || '',
        start_time: auction.start_time ? new Date(auction.start_time).toISOString().slice(0, 16) : '',
        end_time: auction.end_time ? new Date(auction.end_time).toISOString().slice(0, 16) : '',
        time_buffer_seconds: auction.time_buffer_seconds?.toString() || '300',
        category: auction.category || 'art',
        tags: auction.tags?.join(', ') || '',
        status: auction.status || 'upcoming',
      });
      setErrors({});
    }
  }, [auction]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (formData.description.length > 5000) {
      newErrors.description = 'Description must be less than 5000 characters';
    }

    const startingBid = parseFloat(formData.starting_bid);
    if (isNaN(startingBid) || startingBid < 0) {
      newErrors.starting_bid = 'Starting bid must be a positive number';
    }

    if (formData.reserve_price) {
      const reservePrice = parseFloat(formData.reserve_price);
      if (isNaN(reservePrice) || reservePrice < 0) {
        newErrors.reserve_price = 'Reserve price must be a positive number';
      } else if (reservePrice < startingBid) {
        newErrors.reserve_price = 'Reserve price cannot be less than starting bid';
      }
    }

    const minIncrement = parseFloat(formData.minimum_increment);
    if (isNaN(minIncrement) || minIncrement < 0.001) {
      newErrors.minimum_increment = 'Minimum increment must be at least 0.001 ETH';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }

    if (formData.start_time && formData.end_time) {
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);
      
      if (endTime <= startTime) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    const timeBuffer = parseInt(formData.time_buffer_seconds);
    if (isNaN(timeBuffer) || timeBuffer < 60 || timeBuffer > 3600) {
      newErrors.time_buffer_seconds = 'Time buffer must be between 60 and 3600 seconds';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auction || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: Partial<AuctionData> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        starting_bid: parseFloat(formData.starting_bid),
        minimum_increment: parseFloat(formData.minimum_increment),
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        time_buffer_seconds: parseInt(formData.time_buffer_seconds),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        status: formData.status,
      };

      if (formData.reserve_price) {
        updateData.reserve_price = parseFloat(formData.reserve_price);
      }

      await onSave(auction.id, updateData);
      onClose();
    } catch (error) {
      console.error('Failed to update auction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'upcoming': return 'bg-blue-600 text-white';
      case 'ended': return 'bg-gray-600 text-white';
      case 'settled': return 'bg-purple-600 text-white';
      case 'cancelled': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (!isOpen || !auction) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">Edit Auction</h2>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              getStatusBadgeColor(auction.status)
            )}>
              {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Artwork Preview */}
              <div className="lg:col-span-1">
                <Card variant="outlined" className="sticky top-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon size={20} />
                      Artwork Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square rounded-lg overflow-hidden bg-neutral-800 mb-4">
                      {auction.artwork_url ? (
                        <img
                          src={auction.artwork_thumbnail_url || auction.artwork_url}
                          alt={auction.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                          <ImageIcon size={48} />
                        </div>
                      )}
                    </div>
                    
                    {/* Auction Stats */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Creator:</span>
                        <span className="text-white">{auction.creator_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Current Bid:</span>
                        <span className="text-violet font-semibold">{auction.current_bid} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Total Bids:</span>
                        <span className="text-white">{auction.total_bids}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Watching:</span>
                        <span className="text-white">{auction.watchers_count}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText size={20} />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Title"
                      value={formData.title}
                      onChange={handleInputChange('title')}
                      error={errors.title}
                      placeholder="Enter auction title"
                      required
                    />

                    <Textarea
                      label="Description"
                      value={formData.description}
                      onChange={handleInputChange('description')}
                      error={errors.description}
                      placeholder="Describe the artwork and auction details"
                      rows={4}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={handleInputChange('category')}
                          className="w-full h-10 px-3 rounded-lg border border-neutral-700 bg-transparent text-white focus:border-violet focus:ring-2 focus:ring-violet focus:ring-offset-2 focus:ring-offset-neutral-900"
                        >
                          {categoryOptions.map(category => (
                            <option key={category} value={category} className="bg-neutral-800">
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={handleInputChange('status')}
                          className="w-full h-10 px-3 rounded-lg border border-neutral-700 bg-transparent text-white focus:border-violet focus:ring-2 focus:ring-violet focus:ring-offset-2 focus:ring-offset-neutral-900"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value} className="bg-neutral-800">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <Input
                      label="Tags (comma-separated)"
                      value={formData.tags}
                      onChange={handleInputChange('tags')}
                      placeholder="art, digital, collectible, rare"
                      helperText="Separate tags with commas"
                      leftIcon={<Tag size={16} />}
                    />
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign size={20} />
                      Pricing & Bidding
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Starting Bid (ETH)"
                        type="number"
                        step="0.001"
                        min="0"
                        value={formData.starting_bid}
                        onChange={handleInputChange('starting_bid')}
                        error={errors.starting_bid}
                        placeholder="0.1"
                        required
                      />

                      <Input
                        label="Reserve Price (ETH)"
                        type="number"
                        step="0.001"
                        min="0"
                        value={formData.reserve_price}
                        onChange={handleInputChange('reserve_price')}
                        error={errors.reserve_price}
                        placeholder="1.0 (optional)"
                        helperText="Minimum price to sell"
                      />
                    </div>

                    <Input
                      label="Minimum Bid Increment (ETH)"
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={formData.minimum_increment}
                      onChange={handleInputChange('minimum_increment')}
                      error={errors.minimum_increment}
                      placeholder="0.01"
                      required
                    />
                  </CardContent>
                </Card>

                {/* Timing */}
                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar size={20} />
                      Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Start Time"
                        type="datetime-local"
                        value={formData.start_time}
                        onChange={handleInputChange('start_time')}
                        error={errors.start_time}
                        required
                      />

                      <Input
                        label="End Time"
                        type="datetime-local"
                        value={formData.end_time}
                        onChange={handleInputChange('end_time')}
                        error={errors.end_time}
                        required
                      />
                    </div>

                    <Input
                      label="Time Buffer (seconds)"
                      type="number"
                      min="60"
                      max="3600"
                      value={formData.time_buffer_seconds}
                      onChange={handleInputChange('time_buffer_seconds')}
                      error={errors.time_buffer_seconds}
                      placeholder="300"
                      helperText="Time added when bid placed near end (60-3600 seconds)"
                      leftIcon={<Clock size={16} />}
                      required
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-neutral-700 bg-neutral-900/50">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={loading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
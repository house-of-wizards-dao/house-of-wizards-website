import React, { useState, useCallback } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCreateAuction } from "@/lib/auction-contract";
import { useTotalAuctions } from "@/lib/auction-contract";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CreateAuction() {
  const { address, isConnected } = useAccount();
  const { createAuction, isPending, error } = useCreateAuction();
  const { totalAuctions } = useTotalAuctions();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startingPrice: "",
    duration: "7", // days
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    try {
      setSuccess(null);
      
      // Upload image first if selected
      let imageUrl: string | null = null;
      if (selectedImage && !uploadedImageUrl) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          return; // Upload failed, don't proceed
        }
      } else if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
      }
      
      const durationInSeconds = parseInt(formData.duration) * 24 * 60 * 60;

      const result = await createAuction(
        formData.name,
        formData.startingPrice,
        durationInSeconds,
      );

      if (result.success) {
        // Save metadata to database
        if (imageUrl) {
          const nextAuctionId = totalAuctions; // The next auction will have this index
          try {
            const { error: dbError } = await supabase
              .from('contract_auction_metadata')
              .insert({
                contract_auction_id: nextAuctionId,
                name: formData.name,
                description: formData.description,
                image_url: imageUrl,
                thumbnail_url: imageUrl, // Using same URL for now
                created_by: address,
                metadata: {
                  starting_price: formData.startingPrice,
                  duration_days: formData.duration,
                  transaction_hash: result.hash,
                },
              });
            
            if (dbError) {
              console.error('Failed to save auction metadata:', dbError);
            }
          } catch (dbErr) {
            console.error('Database error:', dbErr);
          }
        }
        
        setSuccess(`Auction created successfully! Transaction: ${result.hash}`);
        // Reset form
        setFormData({
          name: "",
          description: "",
          startingPrice: "",
          duration: "7",
        });
        removeImage();
      }
    } catch (err) {
      console.error("Failed to create auction:", err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB');
        return;
      }
      
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }, []);

  const uploadImage = useCallback(async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('maxWidth', '800');
      formData.append('maxHeight', '600');
      formData.append('quality', '0.8');
      formData.append('generateThumbnail', 'true');
      
      const response = await fetch('/api/upload/auction-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const result = await response.json();
      if (result.success && result.images?.[0]?.url) {
        const imageUrl = result.images[0].url;
        setUploadedImageUrl(imageUrl);
        return imageUrl;
      }
      
      throw new Error('Invalid response from upload service');
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setImageUploading(false);
    }
  }, [selectedImage]);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setUploadedImageUrl(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  }, [imagePreview]);

  if (!isConnected) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h2 className="text-xl font-bold">Create New Auction</h2>
        </CardHeader>
        <CardBody className="text-center">
          <p className="mb-4">Connect your wallet to create auctions</p>
          <ConnectButton />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div>
          <h2 className="text-xl font-bold">Create New Auction</h2>
          <p className="text-sm text-gray-600">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Auction Name"
            placeholder="e.g., Beautiful Digital Artwork"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />

          <Textarea
            label="Description"
            placeholder="Describe the artwork..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            minRows={3}
          />

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Auction Image</label>
            
            {!imagePreview && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload" 
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-600 mb-1">Click to upload auction image</span>
                  <span className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</span>
                </label>
              </div>
            )}
            
            {imagePreview && (
              <div className="relative">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={imagePreview}
                      alt="Auction preview"
                      width={120}
                      height={120}
                      className="object-cover rounded-md w-[120px] h-[120px]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{selectedImage?.name}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        {selectedImage && (selectedImage.size / 1024).toFixed(1)} KB
                      </p>
                      {uploadedImageUrl && (
                        <p className="text-xs text-green-600 mb-2">✓ Image uploaded successfully</p>
                      )}
                      <div className="flex gap-2">
                        {!uploadedImageUrl && (
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            isLoading={imageUploading}
                            onClick={uploadImage}
                            disabled={imageUploading}
                          >
                            {imageUploading ? 'Uploading...' : 'Upload Now'}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          onClick={removeImage}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Input
            label="Starting Price (ETH)"
            placeholder="e.g., 1.5"
            type="number"
            step="0.01"
            value={formData.startingPrice}
            onChange={(e) => handleChange("startingPrice", e.target.value)}
            required
          />

          <Select
            label="Duration"
            placeholder="Select auction duration"
            selectedKeys={[formData.duration]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              handleChange("duration", selected);
            }}
          >
            <SelectItem key="1" value="1">
              1 Day
            </SelectItem>
            <SelectItem key="3" value="3">
              3 Days
            </SelectItem>
            <SelectItem key="7" value="7">
              1 Week
            </SelectItem>
            <SelectItem key="14" value="14">
              2 Weeks
            </SelectItem>
            <SelectItem key="30" value="30">
              1 Month
            </SelectItem>
          </Select>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error.message || "Failed to create auction"}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <Button
            type="submit"
            color="primary"
            isLoading={isPending || imageUploading}
            disabled={!formData.name || !formData.startingPrice || isPending || imageUploading}
            className="w-full"
          >
            {isPending ? "Creating Auction..." : imageUploading ? "Uploading Image..." : "Create Auction"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Only contract owner can create auctions</li>
            <li>• Starting price is the minimum bid amount</li>
            <li>• Auction runs for the selected duration</li>
            <li>• Highest bidder wins when time expires</li>
            <li>• You can withdraw winning bids after auction ends</li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}

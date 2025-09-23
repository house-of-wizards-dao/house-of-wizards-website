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
import { LazyImage } from "@/components/ui/LazyImage";

// Supabase removed

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

  // Image upload removed

  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    try {
      setSuccess(null);
      // Supabase removed

      const durationInSeconds = parseInt(formData.duration) * 24 * 60 * 60;

      const result = await createAuction(
        formData.name,
        formData.startingPrice,
        durationInSeconds,
      );

      if (result.success) {
        // Supabase removed

        setSuccess(`Auction created successfully! Transaction: ${result.hash}`);
        // Reset form
        setFormData({
          name: "",
          description: "",
          startingPrice: "",
          duration: "7",
        });
        // removeImage();
      }
    } catch (err) {
      console.error("Failed to create auction:", err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Image selection/upload removed

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

          {/* Image upload removed */}

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
            isLoading={isPending}
            disabled={!formData.name || !formData.startingPrice || isPending}
            className="w-full"
          >
            {isPending ? "Creating Auction..." : "Create Auction"}
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

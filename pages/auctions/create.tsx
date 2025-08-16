import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import Image from "next/image";
import { Upload, ImageIcon, DollarSign, Clock, Info } from "lucide-react";

import DefaultLayout from "@/layouts/default";

const categories = [
  { key: "art", label: "Digital Art" },
  { key: "photography", label: "Photography" },
  { key: "3d", label: "3D Art" },
  { key: "animation", label: "Animation" },
  { key: "pixel", label: "Pixel Art" },
  { key: "generative", label: "Generative Art" },
  { key: "traditional", label: "Traditional Art" },
  { key: "other", label: "Other" },
];

export default function CreateAuctionPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "art",
    starting_bid: "0.00001",
    minimum_increment: "0.00001",
    reserve_price: "",
    duration_hours: "24",
    has_reserve: false,
    start_immediately: true,
    scheduled_start_date: "",
    scheduled_start_time: "",
  });

  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/signup");
    }
  }, [user, router]);

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }

      setArtworkFile(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setArtworkPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !artworkFile) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Upload artwork
      const fileExt = artworkFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(fileName, artworkFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("files")
        .getPublicUrl(fileName);

      // Calculate start and end times
      let startTime = new Date();
      let status = "active";

      // If scheduled for later, parse the scheduled date/time
      if (!formData.start_immediately && formData.scheduled_start_date) {
        const scheduledDateTime = new Date(
          `${formData.scheduled_start_date}T${formData.scheduled_start_time || "00:00"}`,
        );
        if (scheduledDateTime > new Date()) {
          startTime = scheduledDateTime;
          status = "upcoming";
        }
      }

      // Calculate end time based on start time
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + parseInt(formData.duration_hours));

      // Create auction
      const auctionData = {
        creator_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        artwork_url: urlData.publicUrl,
        starting_bid: parseFloat(formData.starting_bid),
        minimum_increment: parseFloat(formData.minimum_increment),
        reserve_price: formData.has_reserve
          ? parseFloat(formData.reserve_price)
          : null,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: status,
      };

      const { data, error: auctionError } = await supabase
        .from("auctions")
        .insert(auctionData)
        .select()
        .single();

      if (auctionError) throw auctionError;

      // Redirect to the new auction
      router.push(`/auctions/${data.id}`);
    } catch (err: any) {
      console.error("Error creating auction:", err);
      setError(err.message || "Failed to create auction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <p className="text-xl text-gray-400">Redirecting to sign up...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-atirose text-violet text-4xl md:text-5xl mb-4">
            Create Auction
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            List your artwork for auction and let collectors bid on your unique
            creations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Artwork Upload */}
            <div className="space-y-6">
              <Card className="border border-darkviolet bg-transparent/50 backdrop-blur-sm">
                <CardHeader>
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <ImageIcon size={20} className="mr-2" />
                    Artwork
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  {/* File Upload */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleArtworkChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                        artworkPreview
                          ? "border-violet bg-violet/5"
                          : "border-darkviolet hover:border-violet"
                      }`}
                    >
                      {artworkPreview ? (
                        <div className="space-y-4">
                          <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden">
                            <Image
                              src={artworkPreview}
                              alt="Artwork preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-violet text-sm">
                            Click to change artwork
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload size={48} className="mx-auto text-gray-400" />
                          <div>
                            <p className="text-white font-medium">
                              Upload your artwork
                            </p>
                            <p className="text-gray-400 text-sm">
                              Drag and drop or click to browse
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              Supports JPG, PNG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4">
                    <Input
                      label="Title"
                      placeholder="Enter artwork title"
                      value={formData.title}
                      onChange={(e) => updateFormData("title", e.target.value)}
                      required
                      className="w-full"
                    />

                    <textarea
                      placeholder="Describe your artwork, inspiration, and technique..."
                      value={formData.description}
                      onChange={(e) =>
                        updateFormData("description", e.target.value)
                      }
                      rows={4}
                      required
                      className="w-full px-3 py-2 bg-background/50 border border-darkviolet rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet transition-colors resize-none"
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Category
                      </label>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button className="w-full justify-start bg-background/50 border border-darkviolet text-white hover:border-violet">
                            {categories.find((c) => c.key === formData.category)
                              ?.label || "Select Category"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Category selection"
                          selectedKeys={[formData.category]}
                          onSelectionChange={(keys) =>
                            updateFormData("category", Array.from(keys)[0])
                          }
                        >
                          {categories.map((category) => (
                            <DropdownItem key={category.key}>
                              {category.label}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right Column - Auction Settings */}
            <div className="space-y-6">
              {/* Pricing */}
              <Card className="border border-darkviolet bg-transparent/50 backdrop-blur-sm">
                <CardHeader>
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <DollarSign size={20} className="mr-2" />
                    Pricing
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    type="number"
                    step="0.00001"
                    min="0"
                    label="Starting Bid (ETH)"
                    placeholder="0.00001"
                    value={formData.starting_bid}
                    onChange={(e) =>
                      updateFormData("starting_bid", e.target.value)
                    }
                    required
                  />

                  <Input
                    type="number"
                    step="0.00001"
                    min="0.00001"
                    label="Minimum Bid Increment (ETH)"
                    placeholder="0.00001"
                    value={formData.minimum_increment}
                    onChange={(e) =>
                      updateFormData("minimum_increment", e.target.value)
                    }
                    required
                  />

                  <div className="space-y-3">
                    <Switch
                      isSelected={formData.has_reserve}
                      onValueChange={(checked) =>
                        updateFormData("has_reserve", checked)
                      }
                    >
                      <span className="text-white">Set Reserve Price</span>
                    </Switch>

                    {formData.has_reserve && (
                      <Input
                        type="number"
                        step="0.001"
                        min="0"
                        label="Reserve Price (ETH)"
                        placeholder="1.0"
                        value={formData.reserve_price}
                        onChange={(e) =>
                          updateFormData("reserve_price", e.target.value)
                        }
                        description="Minimum price to sell (hidden from bidders)"
                      />
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Timing */}
              <Card className="border border-darkviolet bg-transparent/50 backdrop-blur-sm">
                <CardHeader>
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Clock size={20} className="mr-2" />
                    Auction Duration
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Duration
                    </label>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button className="w-full justify-start bg-background/50 border border-darkviolet text-white hover:border-violet">
                          {(() => {
                            const durations = {
                              "1": "1 Hour",
                              "6": "6 Hours",
                              "12": "12 Hours",
                              "24": "1 Day",
                              "72": "3 Days",
                              "168": "1 Week",
                            };
                            return (
                              durations[
                                formData.duration_hours as keyof typeof durations
                              ] || "Select Duration"
                            );
                          })()}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Duration selection"
                        selectedKeys={[formData.duration_hours]}
                        onSelectionChange={(keys) =>
                          updateFormData("duration_hours", Array.from(keys)[0])
                        }
                      >
                        <DropdownItem key="1">1 Hour</DropdownItem>
                        <DropdownItem key="6">6 Hours</DropdownItem>
                        <DropdownItem key="12">12 Hours</DropdownItem>
                        <DropdownItem key="24">1 Day</DropdownItem>
                        <DropdownItem key="72">3 Days</DropdownItem>
                        <DropdownItem key="168">1 Week</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <p className="text-xs text-gray-400">
                      Auction will start immediately and run for the selected
                      duration
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Info Card */}
              <Card className="border border-blue-600/50 bg-blue-600/10 backdrop-blur-sm">
                <CardBody className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Info size={20} className="text-blue-400 mt-0.5" />
                    <div className="text-sm space-y-2">
                      <p className="text-blue-200 font-medium">
                        Auction Guidelines
                      </p>
                      <ul className="text-blue-300 space-y-1 text-xs">
                        <li>• Auctions start immediately upon creation</li>
                        <li>
                          • Bids placed in the last 5 minutes extend the auction
                        </li>
                        <li>
                          • You cannot cancel an auction once bids are placed
                        </li>
                        <li>• A 5% platform fee applies to successful sales</li>
                        <li>• Ensure you own the rights to the artwork</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="border border-red-600 bg-red-600/10 backdrop-blur-sm">
              <CardBody>
                <p className="text-red-400 text-center">{error}</p>
              </CardBody>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-center space-x-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 bg-transparent border border-darkviolet text-gray-300 hover:border-violet hover:bg-violet/20 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={
                !artworkFile || !formData.title || !formData.starting_bid
              }
              className="px-8 py-3 bg-violet hover:bg-violet-600 text-white rounded-full font-semibold"
            >
              {isSubmitting ? "Creating Auction..." : "Create Auction"}
            </Button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}

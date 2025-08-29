import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import {
  PhotoIcon,
  CalendarIcon,
  CubeIcon,
  TagIcon,
  InformationCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import type { Auction } from "@/types";

interface ArtworkDetailsProps {
  auction: Auction;
  className?: string;
}

export function ArtworkDetails({ auction, className }: ArtworkDetailsProps) {
  const metadata = auction.artwork_metadata;

  const detailItems = [
    {
      icon: <PhotoIcon className="w-5 h-5" />,
      label: "Title",
      value: metadata?.title || auction.title,
      color: "text-brand-400",
    },
    {
      icon: <CubeIcon className="w-5 h-5" />,
      label: "Medium",
      value: metadata?.medium || "Digital Art",
      color: "text-blue-400",
    },
    {
      icon: <TagIcon className="w-5 h-5" />,
      label: "Dimensions",
      value: metadata?.dimensions || "Variable",
      color: "text-green-400",
    },
    {
      icon: <CalendarIcon className="w-5 h-5" />,
      label: "Year",
      value:
        metadata?.year || new Date(auction.created_at).getFullYear().toString(),
      color: "text-yellow-400",
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Artwork Title & Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {metadata?.title || auction.title}
            </h2>
            {auction.description && (
              <p className="text-neutral-300 leading-relaxed">
                {auction.description}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Artwork Specifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-neutral-800/30 border border-neutral-700/50">
          <CardBody className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <InformationCircleIcon className="w-5 h-5 text-brand-400" />
              <h3 className="text-lg font-semibold text-white">
                Artwork Specifications
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {detailItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800/70 transition-colors"
                >
                  <div className={`${item.color} mt-0.5`}>{item.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm text-neutral-400 mb-1">
                      {item.label}
                    </div>
                    <div className="text-white font-medium">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Technical Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-neutral-800/30 border border-neutral-700/50">
          <CardBody className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DocumentTextIcon className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">
                Technical Information
              </h3>
            </div>

            <div className="space-y-4">
              {/* File Format & Quality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-neutral-800/50">
                  <div className="text-sm text-neutral-400 mb-1">
                    File Format
                  </div>
                  <div className="text-white font-medium">
                    PNG, High Resolution
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-neutral-800/50">
                  <div className="text-sm text-neutral-400 mb-1">
                    Color Space
                  </div>
                  <div className="text-white font-medium">sRGB</div>
                </div>
              </div>

              {/* Blockchain Information */}
              {auction.contract_address && (
                <div className="p-4 rounded-lg bg-brand-500/10 border border-brand-500/20">
                  <div className="text-sm text-brand-400 mb-2 font-medium">
                    Blockchain Details
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 text-sm">Contract</span>
                      <code className="text-white font-mono text-sm bg-black/20 px-2 py-1 rounded">
                        {auction.contract_address.slice(0, 8)}...
                        {auction.contract_address.slice(-8)}
                      </code>
                    </div>
                    {auction.token_id && (
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 text-sm">
                          Token ID
                        </span>
                        <code className="text-white font-mono text-sm bg-black/20 px-2 py-1 rounded">
                          #{auction.token_id}
                        </code>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 text-sm">Standard</span>
                      <Chip size="sm" color="primary" variant="flat">
                        ERC-721
                      </Chip>
                    </div>
                  </div>
                </div>
              )}

              {/* Provenance */}
              <div className="p-4 rounded-lg bg-neutral-800/50">
                <div className="text-sm text-neutral-400 mb-2">Provenance</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white text-sm">
                      Created by verified artist
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white text-sm">
                      First auction on House of Wizards
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-400 rounded-full"></div>
                    <span className="text-white text-sm">
                      Authenticated & stored on IPFS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Artwork Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Key Features</h3>

          <div className="flex flex-wrap gap-2">
            {[
              "High Resolution",
              "Digital Original",
              "Limited Edition",
              "Artist Signed",
              "Certificate of Authenticity",
              "Commercial License",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              >
                <Chip
                  size="sm"
                  variant="bordered"
                  classNames={{
                    base: "border-neutral-600 hover:border-brand-500 transition-colors",
                    content: "text-neutral-300 group-hover:text-brand-400",
                  }}
                >
                  {feature}
                </Chip>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Additional Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-yellow-500/5 border border-yellow-500/20">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <div className="text-yellow-400 font-medium text-sm">
                  Important Information
                </div>
                <div className="text-neutral-300 text-sm leading-relaxed">
                  This artwork is sold as a unique digital collectible. The
                  winning bidder will receive full ownership rights, including a
                  high-resolution file and certificate of authenticity. The
                  artwork will be transferred to the winner's wallet upon
                  payment confirmation.
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

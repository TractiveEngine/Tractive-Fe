"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bidService, SingleBid } from "@/services/bidService";
import { toast } from "sonner";
import Image from "next/image";

interface BiddersModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
}

export const BiddersModal: React.FC<BiddersModalProps> = ({
  isOpen,
  onClose,
  listingId,
}) => {
  const [bidders, setBidders] = useState<SingleBid[]>([]);
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingBidId, setProcessingBidId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isOpen && listingId) {
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, listingId]);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const details = await bidService.getBidDetails(listingId);
      setBidders(details.bids);
      setProductName(details.productName);
    } catch (error) {
      toast.error("Failed to load bidders");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (
    bidId: string,
    status: "accepted" | "rejected",
  ) => {
    setProcessingBidId(bidId);
    try {
      await bidService.updateBidStatus(bidId, { status });
      toast.success(`Bid ${status} successfully`);

      // Refresh local state or fetch again
      setBidders((prev) =>
        prev.map((b) => (b.id === bidId ? { ...b, status } : b)),
      );
    } catch (error) {
      toast.error("Failed to update bid");
    } finally {
      setProcessingBidId(null);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#2b2b2b94] bg-opacity-50 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-[10px] w-full max-w-[600px] shadow-lg overflow-hidden flex flex-col max-h-[80vh]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="w-full">
                {/* Search bar placeholder as per design */}
                <div className="relative w-full max-w-sm mb-2">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-8 py-2 border rounded-md text-sm focus:outline-none focus:border-[#538e53]"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Table Header */}
            <div className="flex items-center px-6 py-3 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <div className="w-1/3">Name</div>
              <div className="w-1/3 text-center">Amount</div>
              <div className="w-1/3 text-right">Action</div>
            </div>

            {/* List */}
            <div className="overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-gray-200 flex-grow">
              {isLoading ? (
                <div className="py-10 flex justify-center text-gray-500">
                  Loading...
                </div>
              ) : bidders.length === 0 ? (
                <div className="py-10 text-center text-gray-500 text-sm">
                  No bidders yet.
                </div>
              ) : (
                <>
                  {bidders
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((bidder) => (
                      <div
                        key={bidder.id}
                        className="flex items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        {/* Name & Avatar */}
                        <div className="w-1/3 flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            <Image
                              src={
                                bidder?.bidderAvatar ||
                                "/images/placeholder-avatar.png"
                              }
                              alt={bidder?.bidderName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-montserrat text-sm text-[#2b2b2b] truncate pr-2">
                            {bidder?.bidderName}
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="w-1/3 text-center font-montserrat text-sm text-[#2b2b2b]">
                          ₦{bidder?.amount?.toLocaleString()}
                        </div>

                        {/* Actions */}
                        <div className="w-1/3 flex flex-col items-end gap-1">
                          {bidder.status === "pending" ||
                          bidder.status === "rejected" ? (
                            <button
                              onClick={() => handleAction(bidder.id, "accepted")}
                              disabled={processingBidId === bidder.id}
                              className="text-xs font-montserrat text-[#538e53] hover:underline disabled:opacity-50"
                            >
                              Request payment
                            </button>
                          ) : bidder.status === "accepted" ? (
                            <button
                              onClick={() => handleAction(bidder.id, "rejected")}
                              disabled={processingBidId === bidder.id}
                              className="text-xs font-montserrat text-[#D32F2F] hover:underline disabled:opacity-50"
                            >
                              Cancel request
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-blue-600">
                              Countered
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>

            {/* Pagination Footer */}
            {!isLoading && bidders.length > itemsPerPage && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500">
                  Page {currentPage} of {Math.ceil(bidders.length / itemsPerPage)}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.ceil(bidders.length / itemsPerPage), p + 1)
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(bidders.length / itemsPerPage)
                  }
                  className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

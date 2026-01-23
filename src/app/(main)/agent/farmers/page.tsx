"use client";
import React, { useState } from "react";
import { FarmerList } from "./_components/FarmerList";
import { FarmerFormModal, FarmerFormData } from "./_components/FarmerFormModal";
import { Farmer } from "@/services/FarmerService";
import {
  useFarmers,
  useCreateFarmer,
  useUpdateFarmer,
} from "@/hooks/queries/useFarmerQueries";
import { toast } from "sonner";

import { FarmerDetailModal } from "./_components/FarmerDetailModal";

const FarmersListPage: React.FC = () => {
  // Local state for modals and editing
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFarmer, setEditFarmer] = useState<Farmer | null>(null);
  const [viewFarmer, setViewFarmer] = useState<Farmer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // React Query hooks
  const {
    data: farmersResponse,
    isLoading: farmersLoading,
    error: farmersError,
  } = useFarmers();
  const createFarmerMutation = useCreateFarmer();
  const updateFarmerMutation = useUpdateFarmer();

  const farmersData = farmersResponse?.farmers || [];

  // Handlers
  const handleView = (id: string) => {
    console.log(`Viewing farmer with ID: ${id}`);
    const farmer = farmersData.find((f) => f.id === id);
    if (farmer) {
      setViewFarmer(farmer);
      setIsDetailModalOpen(true);
    } else {
      console.error(`❌ Farmer with ID ${id} not found`);
      toast.error("Farmer not found");
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Editing farmer with ID: ${id}`);
    const farmer = farmersData.find((f) => f.id === id);
    if (farmer) {
      setEditFarmer(farmer);
      setIsEditModalOpen(true);
    } else {
      console.error(`❌ Farmer with ID ${id} not found`);
      toast.error("Farmer not found");
    }
  };

  const handleOnboardSubmit = async (formData: FarmerFormData) => {
    try {
      await createFarmerMutation.mutateAsync(formData);
      setIsOnboardModalOpen(false);
    } catch (error) {
      console.error("❌ Error creating farmer:", error);
    }
  };

  const handleEditSubmit = async (formData: FarmerFormData) => {
    if (!editFarmer) {
      toast.error("No farmer selected for editing");
      return;
    }

    try {
      await updateFarmerMutation.mutateAsync({
        id: editFarmer.id,
        data: formData,
      });
      setIsEditModalOpen(false);
      setEditFarmer(null);
    } catch (error) {
      console.error("❌ Error updating farmer:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="w-[95%] mx-auto mb-5 flex flex-col bg-[#fefefe] rounded-[10px] shadow-md">
        <h2 className="text-[17px] font-montserrat text-[#808080] px-6 pt-6 mb-4">
          Farmers{" "}
          {/* {(farmersLoading ||
            createFarmerMutation.isPending ||
            updateFarmerMutation.isPending) && (
            <span className="text-sm text-gray-500">(Loading...)</span>
          )}
          {farmersData.length > 0 && (
            <span className="text-sm text-gray-600 ml-2">
              ({farmersData.length} total)
            </span>
          )} */}
        </h2>

        {/* Error Message */}
        {farmersError && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm font-semibold mb-1">Error</p>
            <p className="text-red-600 text-sm">
              {farmersError?.message || "Failed to load farmers"}
            </p>
          </div>
        )}

        {/* Modals */}
        <FarmerFormModal
          isOpen={isOnboardModalOpen}
          onClose={() => setIsOnboardModalOpen(false)}
          onSubmit={handleOnboardSubmit}
          isSubmitting={createFarmerMutation.isPending}
        />

        <FarmerFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditFarmer(null);
          }}
          onSubmit={handleEditSubmit}
          editFarmer={editFarmer}
          isSubmitting={updateFarmerMutation.isPending}
        />

        <FarmerDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewFarmer(null);
          }}
          farmer={viewFarmer}
        />

        <div className="w-full h-[1px] bg-[#e2e2e2]"></div>

        {/* List Component */}
        <FarmerList
          farmers={farmersData}
          isLoading={farmersLoading}
          onEdit={handleEdit}
          onView={handleView}
          onAdd={() => setIsOnboardModalOpen(true)}
        />
      </div>
    </div>
  );
};

export default FarmersListPage;

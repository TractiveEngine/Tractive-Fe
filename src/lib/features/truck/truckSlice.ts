import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TruckItem } from "@/utils/TruckData";

interface TruckState {
  selectedTruck: TruckItem | null;
}

const initialState: TruckState = {
  selectedTruck: null,
};

const truckSlice = createSlice({
  name: "truck",
  initialState,
  reducers: {
    setSelectedTruck(state, action: PayloadAction<TruckItem>) {
      state.selectedTruck = action.payload;
    },
    clearSelectedTruck(state) {
      state.selectedTruck = null;
    },
  },
});

export const { setSelectedTruck, clearSelectedTruck } = truckSlice.actions;
export default truckSlice.reducer;

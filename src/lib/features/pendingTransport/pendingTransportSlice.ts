import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PendingTransportState {
  orderIds: string[];
}

const initialState: PendingTransportState = {
  orderIds: [],
};

const pendingTransportSlice = createSlice({
  name: "pendingTransport",
  initialState,
  reducers: {
    setPendingTransportOrderIds(state, action: PayloadAction<string[]>) {
      state.orderIds = action.payload;
    },
    clearPendingTransport(state) {
      state.orderIds = [];
    },
  },
});

export const { setPendingTransportOrderIds, clearPendingTransport } =
  pendingTransportSlice.actions;
export default pendingTransportSlice.reducer;

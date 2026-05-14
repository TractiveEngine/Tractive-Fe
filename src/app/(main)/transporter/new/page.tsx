"use client";
import React from "react";
import "./TrackOrder.css";
import { BookingTripsView } from "../_components/BookingTripsView";

export default function TrackOrderPage() {
  return <BookingTripsView defaultTab="new" showDummyReference />;
}

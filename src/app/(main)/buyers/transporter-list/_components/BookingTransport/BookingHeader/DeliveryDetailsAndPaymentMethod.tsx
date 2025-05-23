import React from 'react'
import { TruckItem } from './ImagePreviewBooking'


interface DeliveryDetailsAndPaymentMethodProps {
  item: TruckItem
}

export const DeliveryDetailsAndPaymentMethod: React.FC<
  DeliveryDetailsAndPaymentMethodProps> = ({item}) => {
    return <div>DeliveryDetailsAndPaymentMethod { item.truckName}</div>;
};

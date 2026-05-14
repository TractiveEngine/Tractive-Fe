export type BuyerTransactionStatus =
  | "pending"
  | "payment_pending"
  | "paid"
  | "delivered";

export interface BuyerTransactionRow {
  id: string;
  productId: string;
  item: string;
  image: string;
  quantity: string;
  amount: number;
  seller: string;
  method: string;
  date: string;
  status: BuyerTransactionStatus;
}

export interface ContactInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
}

export type Lang = "ko" | "en" | "ja" | "zh";

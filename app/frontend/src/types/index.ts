export type VillaStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Reserved';
export type BookingStatus = 'Active' | 'Completed';

export interface Booking {
  id: number;
  villaId: number;
  guestName: string;
  guestPhone: string;
  guestID: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  pdfPath?: string | null;
  status: BookingStatus;
  villa?: Villa;
}

export interface Villa {
  id: number;
  name: string;
  status: VillaStatus;
  pricePerNight: number;
  bookings?: Booking[];
}


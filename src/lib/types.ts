
export interface Event {
  id: string;
  name: string;
  type: 'Event' | 'ODC' | 'Others';
  date: string; // ISO string
  paymentStatus: 'Paid' | 'Unpaid';
  signInTime?: string;
  signOutTime?: string;
}

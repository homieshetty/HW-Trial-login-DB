export interface Event {
  id: string;
  name: string;
  type: 'Income' | 'Expense';
  date: string; // ISO string
  paymentStatus: 'Paid' | 'Unpaid';
}

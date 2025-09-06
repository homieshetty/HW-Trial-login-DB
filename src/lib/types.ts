

export interface Event {
  id: string;
  name: string;
  type: 'Event' | 'ODC' | 'Others';
  date: string; // ISO string
  paymentStatus: 'Paid' | 'Unpaid';
  signInHour?: number;
  signInMinute?: number;
  signOutHour?: number;
  signOutMinute?: number;
}

export interface LoginFormData {
  email: string;
  password?: string;
}

export interface SignUpFormData extends LoginFormData {
  password: string;
}

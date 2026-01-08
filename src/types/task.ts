export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  status: 'pending' | 'completed' | 'missed';
  createdAt: Date;
  uid: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  date: string;
  time: string;
}

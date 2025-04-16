export interface User {
  id: number;
  employeeId: number;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface Attendance {
  employeeId: number;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  requestPending?: boolean;
  reason?: string;
  requestedChange?: string;
}


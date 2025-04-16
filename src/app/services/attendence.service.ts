import { Injectable } from '@angular/core';
import { Attendance } from '../app.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private attendanceRecords: Attendance[] = [
    {
      date: '2025-04-15',
      checkIn: '09:00',
      checkOut: '15:00',
      status: 'Present',
      employeeId: 2
    },
    {
      date: '2025-04-15',
      checkIn: '09:15',
      checkOut: '18:30',
      status: 'Present',
      employeeId: 3
    },
    {
      date: '2025-04-16',
      checkIn: '09:10',
      checkOut: '17:00',
      status: 'Present',
      employeeId: 2
    },
    {
      date: '2025-04-14',
      checkIn: '09:05',
      checkOut: '16:45',
      status: 'Present',
      employeeId: 3
    },
    {
      date: '2025-04-13',
      checkIn: '09:20',
      checkOut: '17:30',
      status: 'Present',
      employeeId: 2
    }
  ];

  private pendingAdjustments: Attendance[] = [];

  private attendanceSubject = new BehaviorSubject<Attendance[]>(this.attendanceRecords);
  private pendingSubject = new BehaviorSubject<Attendance[]>(this.pendingAdjustments);

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const records = localStorage.getItem('attendanceRecords');
    const pending = localStorage.getItem('pendingAdjustments');
    if (records) {
      this.attendanceRecords = JSON.parse(records);
      this.attendanceSubject.next(this.attendanceRecords);
    }
    if (pending) {
      this.pendingAdjustments = JSON.parse(pending);
      this.pendingSubject.next(this.pendingAdjustments);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('attendanceRecords', JSON.stringify(this.attendanceRecords));
    localStorage.setItem('pendingAdjustments', JSON.stringify(this.pendingAdjustments));
  }

  getAllAttendance(): Observable<Attendance[]> {
    return this.attendanceSubject.asObservable();
  }

  getPendingAdjustments(): Observable<Attendance[]> {
    return this.pendingSubject.asObservable();
  }

  getAttendanceByEmployeeId(employeeId: number): Observable<Attendance[]> {
    const filtered = this.attendanceRecords.filter(r => r.employeeId === employeeId);
    return new BehaviorSubject<Attendance[]>(filtered).asObservable();
  }

  getPendingByEmployeeId(employeeId: number): Observable<Attendance[]> {
    const filtered = this.pendingAdjustments.filter(r => r.employeeId === employeeId);
    return new BehaviorSubject<Attendance[]>(filtered).asObservable();
  }

  requestAdjustment(
    employeeId: number,
    date: string,
    checkIn: string,
    checkOut: string,
    reason: string,
    requestedChange: string
  ): void {
    // Check if there is already a pending adjustment for the given employee and date
    const existingIndex = this.pendingAdjustments.findIndex(
      a => a.employeeId === employeeId && a.date === date
    );
  
    const newRequest: Attendance = {
      employeeId,
      date,
      checkIn,
      checkOut,
      status: 'Pending Approval',
      requestPending: true,
      reason,
      requestedChange
    };
  
    if (existingIndex !== -1) {
      // If a pending request exists, update the reason and requestedChange
      this.pendingAdjustments[existingIndex].reason = reason;
      this.pendingAdjustments[existingIndex].requestedChange = requestedChange;
    } else {
      // Otherwise, push a new request
      this.pendingAdjustments.push(newRequest);
    }
  
    // Update the pending adjustments observable
    this.pendingSubject.next(this.pendingAdjustments);
    this.saveToLocalStorage();
  }
  

  approveAdjustment(date: string, employeeId: number): void {
    const pendingIndex = this.pendingAdjustments.findIndex(
      a => a.employeeId === employeeId && a.date === date
    );

    if (pendingIndex !== -1) {
      const approved = { ...this.pendingAdjustments[pendingIndex] };
      approved.status = 'Present';
      approved.requestPending = false;

      const existingIndex = this.attendanceRecords.findIndex(
        r => r.employeeId === employeeId && r.date === date
      );

      if (existingIndex !== -1) {
        this.attendanceRecords[existingIndex] = approved;
      } else {
        this.attendanceRecords.push(approved);
      }

      this.pendingAdjustments.splice(pendingIndex, 1);

      this.attendanceSubject.next(this.attendanceRecords);
      this.pendingSubject.next(this.pendingAdjustments);
      this.saveToLocalStorage();
    }
  }

  rejectAdjustment(date: string, employeeId: number): void {
    this.pendingAdjustments = this.pendingAdjustments.filter(
      a => !(a.employeeId === employeeId && a.date === date)
    );
    this.pendingSubject.next(this.pendingAdjustments);
    this.saveToLocalStorage();
  }
}

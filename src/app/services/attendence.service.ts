import { Injectable } from '@angular/core';
import { Attendance } from '../app.model';

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
      employeeId: 2,
      requestPending: false,
    },
    {
      date: '2025-04-15',
      checkIn: '09:15',
      checkOut: '18:30',
      status: 'Present',
      employeeId: 3,
      requestPending: false,
    },
    {
      date: '2025-04-16',
      checkIn: '09:10',
      checkOut: '17:00',
      status: 'Present',
      employeeId: 2,
      requestPending: false,
    },
    {
      date: '2025-04-14',
      checkIn: '09:05',
      checkOut: '16:45',
      status: 'Present',
      employeeId: 3,
      requestPending: false,
    },
    {
      date: '2025-04-13',
      checkIn: '09:20',
      checkOut: '17:30',
      status: 'Present',
      employeeId: 2,
      requestPending: false,
    }
  ];

  private draftRecords: Attendance[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const records = localStorage.getItem('attendanceRecords');
    if (records) {
      this.attendanceRecords = JSON.parse(records);
    }
    const drafts = localStorage.getItem('draftRecords');
    if (drafts) {
      this.draftRecords = JSON.parse(drafts);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('attendanceRecords', JSON.stringify(this.attendanceRecords));
    localStorage.setItem('draftRecords', JSON.stringify(this.draftRecords));
  }

  getAllAttendance(): Attendance[] {
    return [...this.attendanceRecords];
  }

  getDraftAdjustments(): Attendance[] {
    return [...this.draftRecords];
  }

  getAttendanceByEmployeeId(employeeId: number): Attendance[] {
    return this.attendanceRecords.filter(r => r.employeeId === employeeId);
  }

  getDraftsByEmployeeId(employeeId: number): Attendance[] {
    return this.draftRecords.filter(r => r.employeeId === employeeId);
  }

  requestAdjustment(
    employeeId: number,
    date: string,
    checkIn: string,
    checkOut: string,
    reason: string,
    requestedChange: string
  ): void {
    const existingDraftIndex = this.draftRecords.findIndex(
      a => a.employeeId === employeeId && a.date === date
    );

    const draft: Attendance = {
      employeeId,
      date,
      checkIn,
      checkOut,
      status: 'Pending Approval',
      requestPending: true,
      reason,
      requestedChange
    };

    if (existingDraftIndex !== -1) {
      this.draftRecords[existingDraftIndex] = draft;
    } else {
      this.draftRecords.push(draft);
    }

    const recordIndex = this.attendanceRecords.findIndex(
      r => r.employeeId === employeeId && r.date === date
    );

    if (recordIndex !== -1) {
      this.attendanceRecords[recordIndex].status = 'Pending Approval';
      this.attendanceRecords[recordIndex].requestPending = true;
    }

    this.saveToLocalStorage();
  }

  approveAdjustment(date: string, employeeId: number): void {
    const draftIndex = this.draftRecords.findIndex(
      a => a.employeeId === employeeId && a.date === date
    );

    if (draftIndex === -1) return;

    const approved = { ...this.draftRecords[draftIndex] };
    approved.status = 'Adjusted';
    approved.requestPending = false;

    const recordIndex = this.attendanceRecords.findIndex(
      r => r.employeeId === employeeId && r.date === date
    );

    if (recordIndex !== -1) {
      this.attendanceRecords[recordIndex] = approved;
    } else {
      this.attendanceRecords.push(approved);
    }

    this.draftRecords.splice(draftIndex, 1);
    this.saveToLocalStorage();
  }

  rejectAdjustment(date: string, employeeId: number): void {
    const draftIndex = this.draftRecords.findIndex(
      a => a.employeeId === employeeId && a.date === date
    );

    if (draftIndex === -1) return;

    const recordIndex = this.attendanceRecords.findIndex(
      r => r.employeeId === employeeId && r.date === date
    );

    if (recordIndex !== -1) {
      this.attendanceRecords[recordIndex].status = 'Rejected';
      this.attendanceRecords[recordIndex].requestPending = false;
    }

    this.draftRecords.splice(draftIndex, 1);
    this.saveToLocalStorage();
  }
}

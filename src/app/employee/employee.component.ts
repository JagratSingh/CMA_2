import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendence.service';
import { Attendance } from '../app.model';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  imports: [FormsModule, NgFor],
  styleUrls: ['./employee.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  attendanceList: Attendance[] = [];
  employeeId!: number;

  date: string = '';
  checkIn: string = '';
  checkOut: string = '';
  reason: string = '';
  requestedChange: string = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    this.employeeId = user.employeeId;
    this.loadAttendance();
  }

  loadAttendance(): void {
    this.attendanceList = this.attendanceService.getAttendanceByEmployeeId(this.employeeId)
  }

  attendenceExists(date: string): boolean {
    return this.attendanceList.some(r => r.employeeId === this.employeeId && r.date === date);
  }

  checkDate(event: any) {
    if (!this.attendenceExists(event.target.value)) {
      alert('Attendance does not exists for this date.');
      event.target.value = '';
    }
  }

  requestAdjustment(): void {

    if (!this.date || !this.checkIn || !this.checkOut || !this.reason.trim() || !this.requestedChange.trim()) {
      alert('Please fill all fields including Reason and Requested Change.');
      return;
    }

    this.attendanceService.requestAdjustment(
      this.employeeId,
      this.date,
      this.checkIn,
      this.checkOut,
      this.reason,
      this.requestedChange
    );

    alert('Adjustment request submitted.');
    this.resetForm();
    this.loadAttendance();
  }

  resetForm(): void {
    this.date = '';
    this.checkIn = '';
    this.checkOut = '';
    this.reason = '';
    this.requestedChange = '';
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const formattedHours = hours % 12 || 12;
    const amPm = hours < 12 ? 'AM' : 'PM';
    return `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${amPm}`;
  }
}

import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendence.service';
import { Attendance } from '../app.model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [NgIf, NgFor],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

export class AdminDashboardComponent implements OnInit {
  allAttendance: Attendance[] = [];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadAllAttendance();
  }

  loadAllAttendance(): void {
    this.attendanceService.getPendingAdjustments().subscribe(records => {
      this.allAttendance = records;
    });
  }

  approve(employeeId: number, date: string): void {
    this.attendanceService.approveAdjustment(date, employeeId);
    this.loadAllAttendance();
  }

  reject(employeeId: number, date: string): void {
    this.attendanceService.rejectAdjustment(date, employeeId);
    this.loadAllAttendance();
  }
}

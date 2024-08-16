import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/login.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {

  auditTrail: any[] = [];
  filteredAuditTrails = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['auditTrailId', 'dateOfTransaction', 'systemUser', 'transactionType', 'additionalData'];

  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedUserEmail: string | null = null;
  selectedTransactionType: string | null = null;

  uniqueUsers: any[] = [];
  uniqueTransactionTypes: string[] = [];

  constructor(private loginService: DataService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginService.GetAllTransaction().subscribe(
      (result: any[]) => {
        this.auditTrail = result;
        this.filteredAuditTrails.data = this.auditTrail;
        this.filteredAuditTrails.sort = this.sort;
        this.extractUniqueValues();
      },
      (error) => {
        this.showSnackBar("Failed to load audit trails. Please contact admin. " + error.error);
      }
    );
  }

  extractUniqueValues() {
    const uniqueUserEmails = new Set();
    this.uniqueUsers = this.auditTrail
      .filter(item => {
        if (uniqueUserEmails.has(item.systemUser.email)) {
          return false;
        } else {
          uniqueUserEmails.add(item.systemUser.email);
          return true;
        }
      })
      .map(item => ({
        email: item.systemUser.email,
        name: item.systemUser.name,
        surname: item.systemUser.surname
      }));

    this.uniqueTransactionTypes = [...new Set(this.auditTrail.map(item => item.transactionType))];
  }

  applyFilters() {
    this.filteredAuditTrails.data = this.auditTrail.filter(item => {
      const matchesDateRange = (!this.startDate || new Date(item.dateOfTransaction) >= this.startDate) &&
                               (!this.endDate || new Date(item.dateOfTransaction) <= this.endDate);
      const matchesUser = !this.selectedUserEmail || item.systemUser.email === this.selectedUserEmail;
      const matchesTransactionType = !this.selectedTransactionType || item.transactionType === this.selectedTransactionType;

      return matchesDateRange && matchesUser && matchesTransactionType;
    });
  }

  clearFilters() {
    this.startDate = null;
    this.endDate = null;
    this.selectedUserEmail = null;
    this.selectedTransactionType = null;
    this.filteredAuditTrails.data = this.auditTrail;
  }

  onStartDateChange(event: any) {
    if (this.endDate && this.startDate && new Date(this.startDate) > new Date(this.endDate)) {
      this.endDate = this.startDate;
      this.applyFilters();
    }
  }

  onEndDateChange(event: any) {
    if (this.startDate && this.endDate && new Date(this.endDate) < new Date(this.startDate)) {
      this.startDate = this.endDate;
      this.applyFilters();
    }
  }

  addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
    });
  }
}

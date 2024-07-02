// shared/EmployeeMonthlyHours.ts
export interface EmployeeMonthlyHours {
    employeeId: number;
    employeeName: string;
    totalMonthlyHours: number;
  }
  export interface EmployeeHoursReport {
    
    year: number;
    month: number;
    week: number;
    totalHours: number;
  }
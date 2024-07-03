// shared/EmployeeMonthlyHours.ts
export interface EmployeeMonthlyHours {
    employeeId: number;
    firstName: string;
    lastName: string;
    week:number;
    totalMonthlyHours: number;
  }
  export interface EmployeeHoursReport {
    firstName: string;
    lastName: string;
    year: number;
    month: number;
    week: number;
    totalHours: number;
    
  }
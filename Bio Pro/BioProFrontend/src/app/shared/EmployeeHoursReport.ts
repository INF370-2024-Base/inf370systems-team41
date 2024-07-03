// shared/EmployeeMonthlyHours.ts
export interface EmployeeWeeklyHours {
  employeeId: number;
  firstName: string;
  lastName: string;
  week: number;
  totalHours: number;
}

export interface EmployeeHoursReport {
  firstName: string;
  lastName: string;
  year: number;
  month: number;
  week: number;
  totalHours: number;
}
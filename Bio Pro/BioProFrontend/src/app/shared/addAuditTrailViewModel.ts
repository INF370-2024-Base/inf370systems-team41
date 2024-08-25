import { DataService } from "../services/login.service";

// dentist.ts
export interface AddAuditTrailViewModels {
  DateOfTransaction: Date;
  SystemUserId: string;
  TransactionType: string;
  AdditionalData: string;
  }

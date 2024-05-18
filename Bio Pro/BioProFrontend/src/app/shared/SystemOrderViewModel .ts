export class SystemOrderViewModel {
    OrderId: string;
    DentistId: number;
    OrderDate: Date;
    PatientName: string;
    PatientSurname: string;
    MedicalAidId: number;
    MedicalAidNumber: string;
    OrderDirectionId: number;
    MouthArea: string;
    EstimatedDurationInDays: number;
    EmergencyNumber: string;
    DueDate: Date;
    SpecialRequirements: string;
    PriorityLevel: string;
    TeethShadesIds: number[];
    SeletedAreasIds: number[];
    OrderTypeId: number;
    OpenOrderId: number;
    OrderStatusId: number;
    OrderWorkflowTimelineId: number;
    mediaFileViewModels:MediaFileViewModel[]=[]
    constructor() {
      this.OrderId = '';
      this.DentistId = 0;
      this.OrderDate = new Date();
      this.PatientName = '';
      this.PatientSurname = '';
      this.MedicalAidId = 0;
      this.MedicalAidNumber = '';
      this.OrderDirectionId = 0;
      this.MouthArea = '';
      this.EstimatedDurationInDays = 0;
      this.EmergencyNumber = '';
      this.DueDate = new Date();
      this.SpecialRequirements = '';
      this.PriorityLevel = '';
      this.TeethShadesIds = [];
      this.SeletedAreasIds = [];
      this.DentistId = 0;
      this.OrderTypeId = 0;
      this.OpenOrderId = 0;
      this.OrderStatusId = 0;
      this.OrderWorkflowTimelineId = 0;
    }
  }
  export class MediaFileViewModel{
    FileName:string='example.txt';
    FileSelf:string  = "new Uint8Array";
    FileSizeKb:number=1024;
    SystemOrderId:string=""
  }


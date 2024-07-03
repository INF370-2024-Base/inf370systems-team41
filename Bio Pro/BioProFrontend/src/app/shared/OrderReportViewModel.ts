export class  OrderReportViewModel {
    orderId: string;
    dentistId: number;
    orderDate: Date;
    patientName: string;
    patientSurname: string;
    MedicalAidId: number;
    MedicalAidNumber: string;
    OrderDirectionId: number;
    MouthArea: string;
    EstimatedDurationInDays: number;
    EmergencyNumber: string;
    dueDate: Date;
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
      this.orderId = '';
      this.dentistId = 0;
      this.orderDate = new Date();
      this.patientName = '';
      this.patientSurname = '';
      this.MedicalAidId = 0;
      this.MedicalAidNumber = '';
      this.OrderDirectionId = 0;
      this.MouthArea = '';
      this.EstimatedDurationInDays = 0;
      this.EmergencyNumber = '';
      this.dueDate = new Date();
      this.SpecialRequirements = '';
      this.PriorityLevel = '';
      this.TeethShadesIds = [];
      this.SeletedAreasIds = [];
      this.dentistId = 0;
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

  

import { Component, OnInit, Input, Output, EventEmitter ,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA,MatDialogRef  } from '@angular/material/dialog';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { MediaFileViewModel } from '../shared/SystemOrderViewModel ';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldControl } from '@angular/material/form-field';
import { DataService } from '../services/login.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-edit-order-modal',
  templateUrl: './edit-order-modal.component.html',
  styleUrls: ['./edit-order-modal.component.scss'],
  providers: [DatePipe],
})
export class EditOrderModalComponent implements OnInit {
  @Input() order: any;
  @Output() close = new EventEmitter<void>();

  editForm!: FormGroup;
  dentists: any[] = [];
  medicalAids: any[] = [];
  orderTypes: any[] = [];
  orderStatus: any[] = [];
  teethShades: any[] = [];
  selectedTeethShadeIds: number[] = [];
  orderDirections: any[] = [];
  selectedAreas: number[] = [];
  uploadedFiles: CustomFile[] = [];
  uploadedFileUrls: { url: SafeUrl, name: string }[] = [];
  
  priorityLevels = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  constructor( private dialogRef: MatDialogRef<EditOrderModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dataService: OrderService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private loginService:DataService,
    private cdr: ChangeDetectorRef
  ) {
    this.editForm = this.formBuilder.group({
      OrderId: [{ value: '', disabled: true }, Validators.required],
      DentistId: ['', Validators.required],
      OrderDate: ['', Validators.required],
      PatientName: ['', Validators.required],
      PatientSurname: ['', Validators.required],
      MedicalAidId: ['', Validators.required],
      MedicalAidNumber: ['', Validators.required],
      OrderDirectionId: ['', Validators.required],
      PriorityLevel: ['', Validators.required],
      OrderTypeId: ['', Validators.required],
      OrderStatusId: ['', Validators.required],
      EmergencyNumber: ['', [Validators.required, Validators.minLength(10)]],
      SpecialRequirements: [''],
      DueDate: ['', Validators.required],
      MediaFiles: [null]
    });
  }

  ngOnInit(): void {
    
    this.order = this.data.order;
    console.log('Incoming order data:', this.order); 
    console.log( this.order)
    this.loadDentists();
    this.loadMedicalAids();
    this.loadOrderStatuses();
    console.log("OrderId:", this.order.orderId);
    console.log("DentistId:", this.order.dentist.dentistId);
    if(this.order.dentist.patients.any)
    {
      console.log("PatientFirstName:", this.order.dentist.patients[0].firstName);
      console.log("PatientSurname:", this.order.dentist.patients[0].lastname);
      console.log("MedicalAidId:", this.order.dentist.patients[0].medicalAidId);
      console.log("MedicalAidNumber:", this.order.dentist.patients[0].medicalAidNumber);
    }
    
    
    console.log("OrderDirectionId:", this.order.orderWorkflowTimeline.orderDirection.orderDirectionId);
    console.log("PriorityLevel:", this.order.priorityLevel);
    console.log("OrderTypeId:", this.order.orderType.orderTypeId);
    console.log("OrderStatusId:", this.order.orderStatus.orderStatusId);
    console.log("EmergencyNumber:", this.order.emergencyNumber);
    console.log("SpecialRequirements:", this.order.specialRequirements);
    console.log("SelectedTeethShadeIds:", this.order.teethShades);
    console.log("SelectedAreas:", this.order.selectedAreas);
    this.patchForm();
  }

  patchForm() {
    if (this.order) {
      const orderDate = this.datePipe.transform(this.order.orderDate, 'yyyy-MM-dd');
      const dueDate = this.datePipe.transform(this.order.dueDate, 'yyyy-MM-dd');
      if(this.order.dentist.patients.length>0)
        {
          const patchData = {
            OrderId: this.order.orderId,
            DentistId: this.order.dentist.dentistId,
            OrderDate: orderDate,
            PatientName: this.order.dentist.patients[0].firstName,
            PatientSurname: this.order.dentist.patients[0].lastname,
            MedicalAidId: this.order.dentist.patients[0].medicalAidId,
            MedicalAidNumber: this.order.dentist.patients[0].medicalAidNumber,
            OrderDirectionId: this.order.orderWorkflowTimeline.orderDirection.orderDirectionId,
            PriorityLevel: this.order.priorityLevel,
            OrderTypeId: this.order.orderType.orderTypeId,
            OrderStatusId: this.order.orderStatus.orderStatusId,
            EmergencyNumber: this.order.emergencyNumber,
            SpecialRequirements: this.order.specialRequirements,
            DueDate: dueDate,
            SelectedTeethShadeIds: this.order.teethShades.map((ts: TeethShade) => ts.teethShadeId),
            SelectedAreas: this.order.selectedAreas
            
          };
          console.log('Data to be patched into the form:', patchData); 
      this.editForm.patchValue(patchData);
        }
        else{
          const patchData = {
            OrderId: this.order.orderId,
            DentistId: this.order.dentist.dentistId,
            OrderDate: orderDate,
            OrderDirectionId: this.order.orderWorkflowTimeline.orderDirection.orderDirectionId,
            PriorityLevel: this.order.priorityLevel,
            OrderTypeId: this.order.orderType.orderTypeId,
            OrderStatusId: this.order.orderStatus.orderStatusId,
            EmergencyNumber: this.order.emergencyNumber,
            SpecialRequirements: this.order.specialRequirements,
            DueDate: dueDate,
            SelectedTeethShadeIds: this.order.teethShades.map((ts: TeethShade) => ts.teethShadeId),
            SelectedAreas: this.order.selectedAreas
            
          };
          console.log('Data to be patched into the form:', patchData); 
      this.editForm.patchValue(patchData);
        }
      

      

      this.selectedTeethShadeIds =this.order.teethShades.map((ts: TeethShade) => ts.teethShadeId)
      this.selectedAreas = this.order.selectedAreas || [];
      console.log('Selected Teeth Shades:', this.selectedTeethShadeIds); 
      console.log('Selected Areas:', this.selectedAreas); 
    }
  }

  loadDentists(): void {
    this.dataService.getDentists().subscribe(
      (data: any[]) => {
        this.dentists = data;
        console.log('Loaded dentists:', this.dentists); 
      },
      (error) => {
        console.error('Error loading dentists:', error);
      }
    );
  }

  loadMedicalAids(): void {
    this.dataService.getMedicalAids().subscribe(
      (data: any[]) => {
        this.medicalAids = data;
        console.log('Loaded medical aids:', this.medicalAids); 
      },
      (error) => {
        console.error('Error loading medical aids:', error);
      }
    );
  }

  loadOrderTypes(): void {
    this.dataService.getOrderTypes().subscribe(
      (data: any[]) => {
        this.orderTypes = data;
        console.log('Loaded order types:', this.orderTypes);
      },
      (error) => {
        console.error('Error loading order types:', error);
      }
    );
  }

  loadOrderStatuses(): void {
    this.dataService.getOrderStatuses().subscribe(
      (data: any[]) => {
        this.orderStatus = data;
        console.log('Loaded order statuses:', this.orderStatus); 
      },
      (error) => {
        console.error('Error loading order statuses:', error);
      }
    );
  }

  loadTeethShades(): void {
    this.dataService.getTeethShades().subscribe(
      (data: any[]) => {
        this.teethShades = data;
        console.log('Loaded teeth shades:', this.teethShades);
      },
      (error) => {
        console.error('Error loading teeth shades:', error);
      }
    );
  }

  loadOrderDirections(): void {
    this.dataService.getOrderDirections().subscribe(
      (data: any[]) => {
        this.orderDirections = data;
        console.log('Loaded order directions:', this.orderDirections);
      },
      (error) => {
        console.error('Error loading order directions:', error);
      }
    );
  }

  toggleTeethShadeSelection(shadeId: number): void {
    const index = this.selectedTeethShadeIds.indexOf(shadeId);
    if (index === -1) {
      this.selectedTeethShadeIds.push(shadeId);
    } else {
      this.selectedTeethShadeIds.splice(index, 1);
    }
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    console.log('Files selected:', files);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`File ${file.name} size: ${file.size} bytes`);


        if (file.size > maxFileSize) {
          console.log(`File ${file.name} exceeds the maximum file size.`);
          alert(`File ${file.name} is too large. Maximum file size is 5MB.`);
          continue; // Skip the file and move to the next one
        }

        console.log(`Processing file: ${file.name}`);

        const reader = new FileReader();

        reader.onload = (e: any) => {
            const fileContent = e.target.result;
            const byteArray = new Uint8Array(fileContent);
            const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));

            this.uploadedFiles.push({
                name: file.name,
                size: file.size,
                content: byteArray
            });
            console.log(this.uploadedFiles);
            this.uploadedFileUrls.push({ url, name: file.name });
        };

        reader.readAsArrayBuffer(file);
    }
}


  

  onSubmit(): void { console.log('onSubmit called');
    if (this.editForm.valid) {
      const formData = this.editForm.value;
      const viewModel = new SystemOrderViewModel;
      viewModel.OrderId = this.order.orderId,
      viewModel.DentistId = formData.DentistId;
      viewModel.OrderDate = formData.OrderDate;
      viewModel.PatientName = formData.PatientName;
      viewModel.PatientSurname = formData.PatientSurname;
      viewModel.MedicalAidId = formData.MedicalAidId;
      viewModel.MedicalAidNumber = formData.MedicalAidNumber;
      viewModel.OrderDirectionId = this.order.orderWorkflowTimeline.orderDirection.orderDirectionId,
      viewModel.OrderTypeId = this.order.orderType.orderTypeId,
    viewModel.OrderStatusId = formData.OrderStatusId;
    viewModel.EmergencyNumber = formData.EmergencyNumber;
    viewModel.SpecialRequirements = formData.SpecialRequirements;
    viewModel.DueDate = formData.DueDate;
    viewModel.PriorityLevel = formData.PriorityLevel; // Assuming this is an array of IDs
    this.order.teethShades.forEach((teethShades: { teethShadeId: number; }) => {
      viewModel.TeethShadesIds.push(teethShades.teethShadeId)
    });
    this.order.selectedAreas.forEach((area: { selectedAreaId: number; }) => {
      viewModel.SeletedAreasIds.push(area.selectedAreaId)
    });
    viewModel.MouthArea = this.selectedAreas.toString();
    console.log(viewModel.OrderId);
    try {
      if (this.uploadedFiles && Array.isArray(this.uploadedFiles)) {
        // Handle the case when there is one or more files
        viewModel.mediaFileViewModels = this.uploadedFiles.map(file => {
            const mediaFileViewModel = new MediaFileViewModel();
            mediaFileViewModel.FileName = file.name;
            mediaFileViewModel.FileSelf = this.encodeFileContent(file.content);
            mediaFileViewModel.FileSizeKb = file.size;
            mediaFileViewModel.SystemOrderId = viewModel.OrderId;
            return mediaFileViewModel;
        });

        console.log('Media files processed:', viewModel.mediaFileViewModels);
    } else {
        console.error('No uploaded files or uploaded files is not an array:', this.uploadedFiles);
    }
    } catch (error) {
        console.error('Error while mapping mediaFileViewModels:', error);
        throw error; // Rethrow the error after logging it
    }

    console.log('Sending update request to:', `${this.dataService.apiUrl}Api/UpdateOrder`);
    console.log('Data being sent:', viewModel);
    
    this.dataService.updateOrder(viewModel).subscribe(
        () => {
          if(viewModel.mediaFileViewModels!=null)
          {
            viewModel.mediaFileViewModels.forEach(element => {
              this.loginService.addTransaction("Post","Added mediafile "+element.FileName)
            });
            this.loginService.addTransaction("Put","Edited order with ID: "+viewModel.OrderId)
          }
            console.log('Order updated successfully');
            this.dialogRef.close('Order success');
        },
        (error) => {
            console.error('Error updating order:', error);
        }
    );
} else {
    console.log('Form is invalid');
    Object.keys(this.editForm.controls).forEach(field => {
        const control = this.editForm.get(field);
        if (control && control.invalid) {
            console.log(`Field ${field} is invalid. Error: `, control.errors);
        }
    });
}
}

// Helper method for more efficient Base64 encoding
encodeFileContent(content: ArrayBuffer): string {
let binary = '';
const bytes = new Uint8Array(content);
const len = bytes.byteLength;

for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
}

return btoa(binary);

}
  cancel(): void {
    console.log('Cancel function executed'); 
    this.dialogRef.close('Order update canceled');
  }
}
export interface CustomFile {
  name: string;
  size: number;
  content: Uint8Array;
}
interface TeethShade {
  teethShadeId: number;
  colour: string;
  colourName: string;
  colourCode: string;
  s: any[];
}
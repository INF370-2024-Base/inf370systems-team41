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
    console.log('Incoming order data:', this.order); 
    this.order = this.data.order;
    this.loadDentists();
    this.loadMedicalAids();
    this.loadOrderStatuses();
    this.patchForm();
  }

  patchForm() {
    if (this.order) {
      const orderDate = this.datePipe.transform(this.order.systemOrder.orderDate, 'yyyy-MM-dd');
      const dueDate = this.datePipe.transform(this.order.systemOrder.dueDate, 'yyyy-MM-dd');
      
      const patchData = {
        OrderId: this.order.systemOrder.orderId,
        DentistId: this.order.systemOrder.dentistId,
        OrderDate: orderDate,
        PatientName: this.order.patient.firstName,  
        PatientSurname: this.order.patient.lastname,
        MedicalAidId: this.order.patient.medicalAidId,
        MedicalAidNumber: this.order.patient.medicalAidNumber,
        OrderDirectionId: this.order.orderDirection.orderDirectionId,
        PriorityLevel: this.order.systemOrder.priorityLevel,
        OrderTypeId: this.order.systemOrder.orderTypeId,
        OrderStatusId: this.order.systemOrder.orderStatusId,
        EmergencyNumber: this.order.systemOrder.emergencyNumber,
        SpecialRequirements: this.order.systemOrder.specialRequirements,
        DueDate: dueDate,
        SelectedTeethShadeIds: this.order.teethshades,
        SelectedAreas: this.order.selectedAreas
        
      };

      console.log('Data to be patched into the form:', patchData); 
      this.editForm.patchValue(patchData);

      this.selectedTeethShadeIds = this.order.selectedTeethShadeIds || [];
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
      viewModel.OrderId = this.order.systemOrder.orderId,
      viewModel.DentistId = formData.DentistId;
      viewModel.OrderDate = formData.OrderDate;
      viewModel.PatientName = formData.PatientName;
      viewModel.PatientSurname = formData.PatientSurname;
      viewModel.MedicalAidId = formData.MedicalAidId;
      viewModel.MedicalAidNumber = formData.MedicalAidNumber;
      viewModel.OrderDirectionId = this.order.orderDirection.orderDirectionId,
      viewModel.OrderTypeId = this.order.systemOrder.orderTypeId,
    viewModel.OrderStatusId = formData.OrderStatusId;
    viewModel.EmergencyNumber = formData.EmergencyNumber;
    viewModel.SpecialRequirements = formData.SpecialRequirements;
    viewModel.DueDate = formData.DueDate;
    viewModel.PriorityLevel = formData.PriorityLevel; // Assuming this is an array of IDs
    this.order.teethshades.forEach((teethShades: { teethShadeId: number; }) => {
      viewModel.TeethShadesIds.push(teethShades.teethShadeId)
    });
    this.order.selectedAreas.forEach((area: { selectedAreaId: number; }) => {
      viewModel.SeletedAreasIds.push(area.selectedAreaId)
    });
    viewModel.MouthArea = this.selectedAreas.toString();
    console.log('Mapping mediaFileViewModels');
    try {
        viewModel.mediaFileViewModels = this.uploadedFiles.map(file => {
            const mediaFileViewModel = new MediaFileViewModel();
            mediaFileViewModel.FileName = file.name;
            mediaFileViewModel.FileSelf = this.encodeFileContent(file.content);
            mediaFileViewModel.FileSizeKb = file.size;
            mediaFileViewModel.SystemOrderId = viewModel.OrderId;
            return mediaFileViewModel;
        });
    } catch (error) {
        console.error('Error while mapping mediaFileViewModels:', error);
        throw error; // Rethrow the error after logging it
    }

    console.log('Sending update request to:', `${this.dataService.apiUrl}Api/UpdateOrder`);
    console.log('Data being sent:', viewModel);

    this.dataService.updateOrder(viewModel).subscribe(
        () => {
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

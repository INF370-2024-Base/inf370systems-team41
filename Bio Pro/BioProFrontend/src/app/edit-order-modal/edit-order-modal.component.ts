import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-order-modal',
  templateUrl: './edit-order-modal.component.html',
  styleUrls: ['./edit-order-modal.component.scss']
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
  uploadedFiles: File[] = [];
  uploadedFileUrls: SafeUrl[] = [];

  priorityLevels = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private sanitizer: DomSanitizer
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
      SelectedTeethShadeIds: [[]],
      DueDate: ['', Validators.required],
      SelectedAreas: [[]],
      MediaFiles: [null]
    });
  }

  ngOnInit(): void {
    this.loadDentists();
    this.loadMedicalAids();
    this.loadOrderTypes();
    this.loadOrderStatuses();
    this.loadTeethShades();
    this.loadOrderDirections();
    this.patchForm();
  }

  patchForm() {
    if (this.order) {
      this.editForm.patchValue({
        OrderId: this.order.systemOrder.orderId,
        DentistId: this.order.systemOrder.dentistId,
        OrderDate: this.order.systemOrder.orderDate,
        PatientName: this.order.systemOrder.patientName,
        PatientSurname: this.order.systemOrder.patientSurname,
        MedicalAidId: this.order.systemOrder.medicalAidId,
        MedicalAidNumber: this.order.systemOrder.medicalAidNumber,
        OrderDirectionId: this.order.systemOrder.orderDirectionId,
        PriorityLevel: this.order.systemOrder.priorityLevel,
        OrderTypeId: this.order.systemOrder.orderTypeId,
        OrderStatusId: this.order.systemOrder.orderStatusId,
        EmergencyNumber: this.order.systemOrder.emergencyNumber,
        SpecialRequirements: this.order.systemOrder.specialRequirements,
        DueDate: this.order.systemOrder.dueDate,
        SelectedTeethShadeIds: this.order.selectedTeethShadeIds,
        SelectedAreas: this.order.selectedAreas
      });

      this.selectedTeethShadeIds = this.order.selectedTeethShadeIds || [];
      this.selectedAreas = this.order.selectedAreas || [];
    }
  }

  loadDentists(): void {
    this.dataService.getDentists().subscribe(
      (data: any[]) => {
        this.dentists = data;
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
    for (let i = 0; i < files.length; i++) {
      this.uploadedFiles.push(files[i]);
      const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(files[i]));
      this.uploadedFileUrls.push(url);
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedOrder = this.editForm.value;
      updatedOrder.SelectedTeethShadeIds = this.selectedTeethShadeIds;
      updatedOrder.SelectedAreas = this.selectedAreas;

      const formData = new FormData();
      for (const key in updatedOrder) {
        if (updatedOrder.hasOwnProperty(key)) {
          formData.append(key, updatedOrder[key]);
        }
      }

      for (let file of this.uploadedFiles) {
        formData.append('MediaFiles', file, file.name);
      }

      this.dataService.updateOrder(formData).subscribe(
        () => {
          console.log('Order updated successfully');
          this.close.emit();
        },
        (error) => {
          console.error('Error updating order:', error);
        }
      );
    } else {
      Object.keys(this.editForm.controls).forEach(field => {
        const control = this.editForm.get(field);
        if (control && control.invalid) {
          console.log(`Field ${field} is invalid. Error: `, control.errors);
        }
      });
    }
  }

  cancel(): void {
    this.close.emit();
  }
}

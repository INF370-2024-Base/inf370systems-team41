import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-order-modal',
  templateUrl: './edit-order-modal.component.html',
  styleUrls: ['./edit-order-modal.component.scss'],
  providers: [DatePipe]
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
  uploadedFileUrls: { url: SafeUrl, name: string }[] = [];

  priorityLevels = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
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
    console.log('Incoming order data:', this.order); // Debug log for incoming order data
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
      const orderDate = this.datePipe.transform(this.order.systemOrder.orderDate, 'yyyy-MM-dd');
      const dueDate = this.datePipe.transform(this.order.systemOrder.dueDate, 'yyyy-MM-dd');
      
      const patchData = {
        OrderId: this.order.systemOrder.orderId,
        DentistId: this.order.systemOrder.dentistId,
        OrderDate: orderDate,
        PatientName: this.order.patient.firsName,  // Note: Correct the spelling if necessary
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
        SelectedTeethShadeIds: this.order.selectedTeethShadeIds,
        SelectedAreas: this.order.selectedAreas
      };

      console.log('Data to be patched into the form:', patchData); // Debug log for data to be patched
      this.editForm.patchValue(patchData);

      this.selectedTeethShadeIds = this.order.selectedTeethShadeIds || [];
      this.selectedAreas = this.order.selectedAreas || [];
      console.log('Selected Teeth Shades:', this.selectedTeethShadeIds); // Debug log for selected teeth shades
      console.log('Selected Areas:', this.selectedAreas); // Debug log for selected areas
    }
  }

  loadDentists(): void {
    this.dataService.getDentists().subscribe(
      (data: any[]) => {
        this.dentists = data;
        console.log('Loaded dentists:', this.dentists); // Debug log for loaded dentists
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
        console.log('Loaded medical aids:', this.medicalAids); // Debug log for loaded medical aids
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
        console.log('Loaded order types:', this.orderTypes); // Debug log for loaded order types
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
        console.log('Loaded order statuses:', this.orderStatus); // Debug log for loaded order statuses
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
        console.log('Loaded teeth shades:', this.teethShades); // Debug log for loaded teeth shades
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
        console.log('Loaded order directions:', this.orderDirections); // Debug log for loaded order directions
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
      this.uploadedFileUrls.push({ url, name: files[i].name });
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedOrder = this.editForm.value;
      updatedOrder.SelectedTeethShadeIds = this.selectedTeethShadeIds;
      updatedOrder.SelectedAreas = this.selectedAreas;
  
      console.log('Sending update request to:', `${this.dataService.apiUrl}Api/UpdateOrder`);
      console.log('Data being sent:', updatedOrder);
  
      this.dataService.updateOrder(updatedOrder).subscribe(
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

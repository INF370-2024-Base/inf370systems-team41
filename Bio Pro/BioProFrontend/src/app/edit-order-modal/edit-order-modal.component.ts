import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';

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

  priorityLevels = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {
    this.editForm = this.formBuilder.group({
      OrderId: ['', Validators.required],
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
      SelectedAreas: [[]]
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
      this.editForm.patchValue(this.order);
      this.selectedTeethShadeIds = this.order.SelectedTeethShadeIds;
      this.selectedAreas = this.order.SelectedAreas;
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

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedOrder = this.editForm.value;
      updatedOrder.SelectedTeethShadeIds = this.selectedTeethShadeIds;
      updatedOrder.SelectedAreas = this.selectedAreas;

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

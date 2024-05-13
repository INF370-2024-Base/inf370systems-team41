import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {

  priorityLevels = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];
  orders: any[] = [];
  dentists: any[] = [];
  medicalAids: any[] = [];
  orderTypes:any[] =[];
  orderStatus:any[] =[];
  teethShades: any[] =[]; 
  selectedTeethShadeIds: number[] = [];
  orderDirections: any[] = [];
  addForm!: FormGroup;
  @ViewChild('imageCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>; 

  constructor(
    private dataService: DataService,
    private httpClient: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.addForm = this.formBuilder.group({
      OrderId: ['', Validators.required],
      DentistId: ['', Validators.required],
      OrderDate: ['', Validators.required],
      PatientName: ['', Validators.required],
      PatientSurname: ['', Validators.required],
      MedicalAidId: ['', Validators.required],
      MedicalAidNumber: ['', Validators.required],
      OrderDirectionId: ['', Validators.required],
      PriorityLevel: ['', Validators.required],
      OrderTypeId: ['', Validators.required], // Ensure OrderTypeId is included in the FormGroup
      OrderStatusId: ['', Validators.required],
      X: ['', Validators.required],
      Y: ['', Validators.required],
      Width: ['', Validators.required],
      Height: ['', Validators.required],
      EmergencyNumber: ['', Validators.required],
      SpecialRequirements: [''],
      SelectedTeethShadeIds: [[]],
      DueDate: ['', Validators.required],
      SelectedAreas: [[]] // Initialize SelectedAreas as an empty array
    });
  }

  ngOnInit(): void {
    this.loadDentists();
    this.loadMedicalAids();
    // this.loadorderDirections();
    this.loadImageOnCanvas();
    this.loadOrderDirections();
    this.loadOrderTypes();
    this.loadOrderStatuses();
    this.loadTeethShades();
  }

  loadDentists(): void {
    this.dataService.getDentists().subscribe(
      (data: any[]) => {
        this.dentists = data;
        console.log('Dentists loaded successfully:', this.dentists);
        
      },
      (error) => {
        console.error('Error loading dentists:', error);
      }
    );
  }

  loadTeethShades(): void {
    this.dataService.getTeethShades().subscribe(
      (data: any[]) => {
        console.log('Teeth shades response:', data); // Log the response data
        this.teethShades = data; // Update component property with fetched data
        console.log('Teeth shades loaded successfully:', this.teethShades);
      },
      (error) => {
        console.error('Error loading teeth shades:', error);
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

  isSelected(shadeId: number): boolean {
    return this.selectedTeethShadeIds.includes(shadeId);
  }


  loadOrderTypes(): void {
    this.dataService.getOrderTypes().subscribe(
      (data: any[]) => {
        this.orderTypes = data;
        console.log('Order types loaded successfully:', this.orderTypes);
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
        console.log('Order statuses loaded successfully:', this.orderStatus);
      },
      (error) => {
        console.error('Error loading order statuses:', error);
      }
    );
  }

  loadOrderDirections(): void {
    this.dataService.getOrderDirections().subscribe(
      (data: any[]) => {
        this.orderDirections = data;
        console.log('Order directions loaded successfully:', this.orderDirections);
      },
      (error) => {
        console.log('Error loading order directions:', error);
      }
    );
  }

  loadMedicalAids(): void {
    this.dataService.getMedicalAids().subscribe(
      (data: any[]) => {
        this.medicalAids = data;
        console.log('Medical aids loaded successfully:', this.medicalAids);
      },
      (error) => {
        console.error('Error loading medical aids:', error);
      }
    );
  }
  
  loadImageOnCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      const imageUrl = 'assets/images/mouth area.png';
      const rectangles: { x: number; y: number; width: number; height: number; }[] = [];
  
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        canvas.addEventListener('mousedown', (event: MouseEvent) => {
          const rectStartX = event.offsetX;
          const rectStartY = event.offsetY;
          let rectWidth = 0;
          let rectHeight = 0;
  
          const mouseMoveHandler = (moveEvent: MouseEvent) => {
            rectWidth = moveEvent.offsetX - rectStartX;
            rectHeight = moveEvent.offsetY - rectStartY;
            this.drawShapes(ctx, img, rectangles); // Use drawShapes to redraw the canvas
          };
  
          const mouseUpHandler = () => {
            canvas.removeEventListener('mousemove', mouseMoveHandler);
            const rect = { x: rectStartX, y: rectStartY, width: rectWidth, height: rectHeight };
            rectangles.push(rect);
            this.drawShapes(ctx, img, rectangles); // Use drawShapes to draw the shapes
            this.updateFormValues(rectangles);
          };
          
          
  
          canvas.addEventListener('mousemove', mouseMoveHandler);
          canvas.addEventListener('mouseup', mouseUpHandler);
        });
      };
  
      img.src = imageUrl;
    }
  }
  
  drawShapes(ctx: CanvasRenderingContext2D, img: HTMLImageElement, rectangles: { x: number; y: number; width: number; height: number; }[]): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0);
  
    for (const rect of rectangles) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
  }
  
  updateFormValues(rectangles: any[]): void {
    // Extract unique selected areas using a Set to avoid duplicates
    const uniqueAreas = Array.from(new Set(rectangles.map(rect => JSON.stringify(rect))))
      .map(str => JSON.parse(str));
  
    // Map the unique areas to the format expected by the form control
    const selectedAreas = uniqueAreas.map(area => ({
      X: area.x,
      Y: area.y,
      Width: area.width,
      Height: area.height
    }));
  
    // Update the form control with the new selected areas
    this.addForm.patchValue({
      SelectedAreas: selectedAreas
    });
  }
  
  
  onSubmit(): void {
    if (this.addForm.valid) {
      const formData = this.addForm.value;
      const systemOrder = {
        OrderId: formData.OrderId,
        DentistId: formData.DentistId,
        OrderDate: formData.OrderDate,
        PatientName: formData.PatientName,
        PatientSurname: formData.PatientSurname,
        MedicalAidId: formData.MedicalAidId,
        MedicalAidNumber: formData.MedicalAidNumber,
        OrderDirectionId: formData.OrderDirectionId,
        OrderTypeId: formData.OrderTypeId,
        OrderStatusId: formData.OrderStatusId,
        EmergencyNumber: formData.EmergencyNumber,
        SpecialRequirements: formData.SpecialRequirements,
        DueDate: formData.DueDate,
        MouthArea: {
          X: formData.X,
          Y: formData.Y,
          Width: formData.Width,
          Height: formData.Height
        }
      };
  
      this.dataService.addOrder(systemOrder).subscribe(
        () => {
          console.log('SystemOrder added successfully!');
          this.router.navigate(['/orders']);
        },
        error => {
          console.error('Error adding SystemOrder:', error);
        }
      );
    }
  }
  
  cancel(): void {
    this.addForm.get('SpecialRequirements')?.reset('');
    this.router.navigate(['/orders']);
  }
}  
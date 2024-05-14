import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';

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
  rectangles:number[] = []; // Array to store rectangles
  selectedIndices:number[] = [];
  areas:any[] = [];
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
      // X: ['', Validators.required],
      // Y: ['', Validators.required],
      // Width: ['', Validators.required],
      // Height: ['', Validators.required],
      EmergencyNumber: ['', [Validators.required, Validators.minLength(10)]],
      SpecialRequirements: [''],
      SelectedTeethShadeIds: [[]],
      DueDate: ['', Validators.required],
      SelectedAreas: [[]] // Initialize SelectedAreas as an empty array
    });
  }

  ngOnInit(): void {
    this.loadDentists();
    this.loadMedicalAids();
    this.loadSelectedAreas();
    this.loadImageOnCanvas();
    this.loadOrderDirections();
    this.loadOrderTypes();
    this.loadOrderStatuses();
    this.loadTeethShades();
    
    console.log(this.areas)
  }
  selectedAreas: number[] = [];
   
  loadImageOnCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      const imageUrl = 'assets/images/mouth area.png';
  
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        canvas.addEventListener('click', (event: MouseEvent) => {
          const clickX = event.offsetX;
          const clickY = event.offsetY;
  
          const clickedArea = this.areas.find((area: Area) => {
            const {x, y, width, height} = area;
            return (
              clickX >= x &&
              clickX <= (x + width) &&
              clickY >= y &&
              clickY <= (y + height)
            );
          }) as Area;
  
          if (clickedArea) {
            const areaIndex = this.selectedAreas.indexOf(clickedArea.selectedAreaId);
            if (areaIndex !== -1) {
              // Area already selected, deselect it
              this.selectedAreas.splice(areaIndex, 1);
              this.updateFormValues()
            } else {
              // Area not selected, select it
              this.selectedAreas.push(clickedArea.selectedAreaId);
              this.updateFormValues()
            }
            this.drawShapes(ctx, img, this.areas, this.selectedAreas); // Pass selected areas for highlighting
          }
        });
      };
  
      img.src = imageUrl;
    }
    
  }
  
  drawShapes(ctx: CanvasRenderingContext2D, img: HTMLImageElement, areas: any[], selectedAreas: number[]) {
    let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    ctx.drawImage(img, 0, 0);
  
    for (const area of areas) {
      const { x, y, width, height } = area;
      ctx.strokeRect(x, y, width, height); // Draw all area outlines
  
      if (selectedAreas.includes(area.selectedAreaId)) {
        // Highlight selected areas with a different color or style
        ctx.fillStyle = 'lightblue'; // Example highlight color
        ctx.fillRect(x, y, width, height);
      }
    }
  }
  
  updateFormValues() {
    // Update your form logic here with selectedAreas list
    console.log('Selected areas:', this.selectedAreas); // Example usage
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
      console.log(this.selectedTeethShadeIds)
    } else {
      this.selectedTeethShadeIds.splice(index, 1);
      console.log(this.selectedTeethShadeIds)
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
  loadSelectedAreas(): void {
    this.dataService.getSelecetedAreas().subscribe(
      (data: any[]) => {
        this.areas = data;
        console.log('Selected Areas loaded successfully:', this.areas);
      },
      (error) => {
        console.error('Error loading Selected Areass:', error);
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
  
  
  
  
  
  
  onSubmit(): void {
    console.log("test")
    if (this.addForm.valid) {
      const formData = this.addForm.value;
      const viewModel = new SystemOrderViewModel;
      viewModel.OrderId = formData.OrderId;
      viewModel.DentistId = formData.DentistId;
      viewModel.OrderDate = formData.OrderDate;
      viewModel.PatientName = formData.PatientName;
      viewModel.PatientSurname = formData.PatientSurname;
      viewModel.MedicalAidId = formData.MedicalAidId;
      viewModel.MedicalAidNumber = formData.MedicalAidNumber;
      viewModel.OrderDirectionId = formData.OrderDirectionId;
      viewModel.OrderTypeId = formData.OrderTypeId;
    viewModel.OrderStatusId = formData.OrderStatusId;
    viewModel.EmergencyNumber = formData.EmergencyNumber;
    viewModel.SpecialRequirements = formData.SpecialRequirements;
    viewModel.DueDate = formData.DueDate;
    viewModel.PriorityLevel = formData.PriorityLevel;
    viewModel.TeethShadesIds = this.selectedTeethShadeIds; // Assuming this is an array of IDs
    viewModel.SeletedAreasIds = this.selectedAreas; // Assuming this is an array of IDs
    viewModel.MouthArea = this.selectedAreas.toString(); // Convert to string if necessary

      console.log(viewModel)
      this.dataService.addOrder(viewModel).subscribe(
        () => {
          console.log('SystemOrder added successfully!');
          this.router.navigate(['/orders']);
        },
        // (error: HttpErrorResponse) => {
        //   if (error.status === 400) {
        //     console.error('Server validation error:', error);
        //     if (error.error instanceof ErrorEvent) {
        //       // A client-side or network error occurred. Handle it accordingly.
        //       console.error('An error occurred:', error.error.message);
        //     } else {
        //       // The backend returned an unsuccessful response code.
        //       // The response body may contain clues as to what went wrong.
        //       console.error(
        //         `Backend returned code ${error.status}, ` +
        //         `body was: ${error.error}`);
        //     }
        //   } else {
        //     console.error('Unexpected error:', error);
        //   }
        // }
      );
    }
  
    else{
      Object.keys(this.addForm.controls).forEach(field => {
        const control = this.addForm.get(field);
        if(control)
        if (control.invalid) {
          console.log(`Field ${field} is invalid. Error: `, control.errors);
        }
      });
    }
    
  }
  
  cancel(): void {
    this.addForm.get('SpecialRequirements')?.reset('');
    this.router.navigate(['/orders']);
  }
  hasError(controlName: string, errorName: string) {
    return this.addForm.controls[controlName].hasError(errorName);
   }
}  
interface Area {
  selectedAreaId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  
}

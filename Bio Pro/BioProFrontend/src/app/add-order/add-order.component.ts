import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../services/order.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateValidator } from '../validators/Validators';
import { PhoneChecker } from '../validators/Validators';
import { error } from 'console';

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
  orderdirection:any

  @ViewChild('imageCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>; 
  constructor(
    private dataService: OrderService,
    private httpClient: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,private snackBar:MatSnackBar
  ) {
    this.addForm = this.formBuilder.group({
      OrderId: ['', [Validators.required,Validators.maxLength(7),Validators.minLength(7)]],
      DentistId: ['', Validators.required],
      OrderDate: ['', Validators.required],
      PatientName: ['', Validators.required],
      PatientSurname: ['', Validators.required],
      MedicalAidId: ['', Validators.required],
      MedicalAidNumber: ['', Validators.required],
      OrderDirectionId: ['', Validators.required],
      PriorityLevel: ['', Validators.required],
      OrderTypeId: ['', Validators.required], // Ensure OrderTypeId is included in the FormGroup
      EmergencyNumber: ['', [Validators.required,PhoneChecker.SouthAfricanPhoneNumberValidator()]],
      SpecialRequirements: [''],
      SelectedTeethShadeIds: [[]],
      DueDate: ['', [Validators.required,DateValidator.dateGreaterThanToday()]],
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
    const scaleFactor = 0.5; // Adjust this scale factor to make the canvas bigger
  
    if (ctx) {
      const imageUrl = 'assets/images/mouth area.png';
  
      const img = new Image();
      img.onload = () => {
        // Set desired canvas dimensions
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw scaled image
  
        canvas.addEventListener('click', (event: MouseEvent) => {
          // Adjust click coordinates for scaling
          const clickX = event.offsetX / scaleFactor;
          const clickY = event.offsetY / scaleFactor;
  
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
            this.drawShapes(ctx, img, this.areas, this.selectedAreas, scaleFactor); // Pass selected areas for highlighting
          }
        });
      };
  
      img.src = imageUrl;
    }
  }
  
  drawShapes(ctx: CanvasRenderingContext2D, img: HTMLImageElement, areas: any[], selectedAreas: number[], scaleFactor: number) {
    let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw scaled image
  
    for (const area of areas) {
      const { x, y, width, height } = area;
      // Draw scaled rectangles
      ctx.strokeRect(x * scaleFactor, y * scaleFactor, width * scaleFactor, height * scaleFactor);
  
      if (selectedAreas.includes(area.selectedAreaId)) {
        // Highlight selected areas with a different color or style
        ctx.fillStyle = 'lightblue'; // Example highlight color
        ctx.fillRect(x * scaleFactor, y * scaleFactor, width * scaleFactor, height * scaleFactor);
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
  showSnackBar(forgetmessage:string) {
    this.snackBar.open(forgetmessage, 'Dismiss', {
      duration: 3000, 
    });
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
  getOrderDirection(event: any): void {
    console.log(event.source);
    const selectedOrderDirectionId = event.value;
    console.log('Selected Order Direction ID:', selectedOrderDirectionId);
    this.dataService.getOrderDirectionById(selectedOrderDirectionId).subscribe(result => {
        this.orderdirection = result;
        console.log(this.orderdirection);
    });
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
    if(this.selectedTeethShadeIds.length<1)
      {
        this.showSnackBar(`Teethshades are required`)
      }
      else{
        if(this.selectedAreas.length<1)
          {
            this.showSnackBar(`SelectedAreas are required`)
          }
          else{
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
                    viewModel.OrderDirectionId = this.orderdirection.orderDirectionId;
                    viewModel.OrderTypeId = formData.OrderTypeId;
                    viewModel.OrderStatusId = 1;
                    viewModel.EmergencyNumber = formData.EmergencyNumber;
                    viewModel.SpecialRequirements = formData.SpecialRequirements;
                    viewModel.DueDate = formData.DueDate;
                    viewModel.PriorityLevel = formData.PriorityLevel;
                    viewModel.TeethShadesIds = this.selectedTeethShadeIds; // Assuming this is an array of IDs
                    viewModel.SeletedAreasIds = this.selectedAreas; // Assuming this is an array of IDs
                    viewModel.MouthArea = this.selectedAreas.toString(); // Convert to string if necessary
                const today=new Date()
                      console.log(viewModel)
                      this.dataService.addOrder(viewModel).subscribe(
                        (result) => {
                          console.log('SystemOrder added successfully!');
                          const dueDate = new Date(viewModel.DueDate);
                          const adjustedDueDate = new Date(dueDate);
                          console.log(this.orderdirection)
                          adjustedDueDate.setDate(dueDate.getDate() - this.orderdirection.estimatedDurationInDays);
                          if (adjustedDueDate < today) {
                            alert("Due dates will not be autofilled on approval");
                         }
                          this.router.navigate(['/orders']);
                        },
                      (error:HttpErrorResponse)=>
                      {
                        console.log(error)
                        this.showSnackBar(error.error)
                      }
                      )
                                   
                             
            }
          
            else{
              Object.keys(this.addForm.controls).forEach(field => {
                const control = this.addForm.get(field);
                if(control)
                if (control.invalid) {
                  this.showSnackBar(`${field} is required`)
                }
              });
            }
          }
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

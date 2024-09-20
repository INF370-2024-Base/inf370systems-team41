import { Component, OnInit, ViewChild, ElementRef, Sanitizer } from '@angular/core';
import { OrderService } from '../services/order.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaFileViewModel, SystemOrderViewModel } from '../shared/SystemOrderViewModel ';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateValidator } from '../validators/Validators';
import { PhoneChecker } from '../validators/Validators';
import { error } from 'console';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../services/login.service';
import { teethAreas } from '../shared/TeethAreas';
import { modifyAndExportGltf } from '../shared/createTeethModel';
import { MatDialog } from '@angular/material/dialog';
import { ModellingComponent } from '../modelling/modelling.component';
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
  orderdirection:any;
   today = new Date();
  todayDate = this.datePipe.transform(new Date(this.today.setDate(this.today.getDate())), 'yyyy-MM-dd');
  twoDaysAhead = this.datePipe.transform(new Date(this.today.setDate(this.today.getDate() + 2)), 'yyyy-MM-dd');
  uploadedFiles:CustomFile[] = [];
  @ViewChild('imageCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>; 
  teeth: Tooth[] = teethAreas
  constructor(
    private dataService: OrderService,
    private httpClient: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,private snackBar:MatSnackBar,private datePipe: DatePipe,private sanitizer:DomSanitizer,private loginService:DataService,public dialog: MatDialog
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
  }
  selectedAreas: number[] = [];
   
  
  loadImageOnCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    const scaleFactor = 0.5;

    if (ctx) {
      const imageUrl = 'assets/images/mouth area.png';

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.addEventListener('click', (event: MouseEvent) => {
          const clickX = event.offsetX / scaleFactor;
          const clickY = event.offsetY / scaleFactor;

          const clickedTooth = this.teeth.find(tooth => 
            this.isPointInPolygon(clickX, clickY, tooth.vertices)
          );

          if (clickedTooth) {
            const toothIndex = this.selectedAreas.indexOf(clickedTooth.id);
            if (toothIndex !== -1) {
              this.selectedAreas.splice(toothIndex, 1);
              console.log( this.selectedAreas)
            } else {
              this.selectedAreas.push(clickedTooth.id);
              console.log( this.selectedAreas)
            }
            this.drawShapes(ctx, img, this.teeth, this.selectedAreas, scaleFactor);
          }
        });
      };

      img.src = imageUrl;
    }
  }

  drawShapes(ctx: CanvasRenderingContext2D, img: HTMLImageElement, teeth: Tooth[], selectedTeeth: number[], scaleFactor: number) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const tooth of teeth) {
      this.drawPolygon(ctx, tooth.vertices.map(v => ({ x: v.x * scaleFactor, y: v.y * scaleFactor })));
      
      if (selectedTeeth.includes(tooth.id)) {
        ctx.fillStyle = 'lightblue';
        this.fillPolygon(ctx, tooth.vertices.map(v => ({ x: v.x * scaleFactor, y: v.y * scaleFactor })));
      }
    }
  }

  drawPolygon(ctx: CanvasRenderingContext2D, vertices: { x: number; y: number }[]) {
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  fillPolygon(ctx: CanvasRenderingContext2D, vertices: { x: number; y: number }[]) {
    ctx.save(); // Save the current drawing state
    
    // Set semi-transparent light blue fill color
    ctx.fillStyle = 'rgba(173, 216, 230, 0.5)'; // Light sky blue with 50% opacity
    
    // Set globalAlpha for overall transparency control
    ctx.globalAlpha = 1; // Adjust this value between 0 and 1 for desired transparency
    
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.restore(); // Restore the original drawing state
  }

  isPointInPolygon(x: number, y: number, vertices: { x: number; y: number }[]): boolean {
    let inside = false;
    const len = vertices.length;

    for (let i = 0, j = len - 1; i < len; j = i++) {
      const xi = vertices[i].x;
      const yi = vertices[i].y;
      const xj = vertices[j].x;
      const yj = vertices[j].y;

      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }
  
  updateFormValues() {
    // Update your form logic here with selectedAreas list
    console.log('Selected areas:', this.selectedAreas); // Example usage
  }
  patchDueDate(): void {
    const dueDate = this.addDays(new Date(), 14);
    this.addForm.patchValue({ DueDate: this.formatDate(dueDate) });
}

addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
  
  loadDentists(): void {
    this.addForm.patchValue({ OrderDate: this.formatDate(new Date()) });
    this.patchDueDate()
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
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
  
  async saveCanvasAsImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
      const dataURL = canvas.toDataURL('image/png');
  
      // Convert data URL to Blob
      const blob = this.dataURLtoBlob(dataURL);
  
      // Read Blob as Uint8Array
      const fileReader = new FileReader();
      fileReader.onload = () => {
        try {
          const arrayBuffer = fileReader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          const maxFileSize = 10 * 1024 * 1024; // 10MB
  
          const fileSize = uint8Array.byteLength;
          console.log(`File TeethAreas.png size: ${fileSize} bytes`);
  
          if (fileSize > maxFileSize) {
            console.log(`File TeethAreas.png exceeds the maximum file size.`);
            alert(`File TeethAreas.png is too large. Maximum file size is 10MB.`);
            reject(new Error('File size exceeds the maximum limit'));
            return; // Skip processing if file size exceeds limit
          }
  
          console.log('Processing file: TeethAreas.png');
          
          const mediaFile = new MediaFileViewModel();
          mediaFile.FileName = 'TeethAreas.png';
          mediaFile.FileSelf = this.encodeFileContent(uint8Array);
          mediaFile.FileSizeKb = Math.ceil(fileSize / 1024);
          mediaFile.SystemOrderId = "1";
  
          const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  
          this.uploadedFiles.push({
            name: mediaFile.FileName,
            size: fileSize,
            content: uint8Array
          });
          console.log(this.uploadedFiles);
  
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsArrayBuffer(blob);
    });
  }
  
  dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  }
  encodeFileContent(content: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(content);
    const len = bytes.byteLength;
    
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    
    return btoa(binary);
    
    }
    
  
  
    async onSubmit(): Promise<void> {
      if (this.selectedTeethShadeIds.length < 1) {
        this.showSnackBar('Teethshades are required');
      } else {
        if (this.selectedAreas.length < 1) {
          this.showSnackBar('SelectedAreas are required');
          console.log()
        } else {
          if (this.addForm.valid) {
            try {
              await this.saveCanvasAsImage(); // Ensure the canvas image is saved before proceeding
    
              const formData = this.addForm.value;
              const viewModel = new SystemOrderViewModel();
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
    
              const today = new Date();
              console.log(this.uploadedFiles);
    
              try {
                const uniqueFiles = new Map<string, CustomFile>();
                  this.uploadedFiles.forEach(file => {
                      if (!uniqueFiles.has(file.name)) {
                          uniqueFiles.set(file.name, file);
                      }
                  });

                  viewModel.mediaFileViewModels = [...uniqueFiles.values()].map(file => {
                      const mediaFileViewModel = new MediaFileViewModel();
                      mediaFileViewModel.FileName = file.name;
                      mediaFileViewModel.FileSelf = this.encodeFileContent(file.content);
                      mediaFileViewModel.FileSizeKb = file.size;
                      mediaFileViewModel.SystemOrderId = viewModel.OrderId;
                      return mediaFileViewModel;
                  });
                  const toothModelContent= await modifyAndExportGltf("assets/models/teeth.glb",this.selectedAreas)
                  const toothModelFile = new MediaFileViewModel();
                  toothModelFile.FileName = 'ToothModel.gltf'; // You can dynamically change this if needed
                  toothModelFile.FileSelf = await this.encodeFileContentFromBlob(toothModelContent); // Assuming `toothModelContent` contains the GLTF file content
                  toothModelFile.FileSizeKb = this.getFileSizeKb(toothModelContent); // Implement a function to get the size in KB
                  toothModelFile.SystemOrderId = viewModel.OrderId;
                  viewModel.mediaFileViewModels.push(toothModelFile);
              } catch (error) {
                console.error('Error while mapping mediaFileViewModels:', error);
                throw error;
              }
    
              console.log(viewModel);
              this.dataService.addOrder(viewModel).subscribe(
                (result) => {
                  this.loginService.addTransaction("Post","Created an order. Order ID:"+viewModel.OrderId)
                  console.log('SystemOrder added successfully!');
                  const dueDate = new Date(viewModel.DueDate);
                  const adjustedDueDate = new Date(dueDate);
                  console.log(this.orderdirection);
                  adjustedDueDate.setDate(dueDate.getDate() - this.orderdirection.estimatedDurationInDays);
                  if (adjustedDueDate < today) {
                    alert('Due dates will not be autofilled on approval');
                  }
                  this.router.navigate(['/orders']);
                },
                (error: HttpErrorResponse) => {
                  console.log(error);
                  this.showSnackBar(error.error);
                }
              );
            } catch (error) {
              console.error('Error saving canvas as image or adding order:', error);
              this.showSnackBar('An error occurred while processing your request. Please try again.');
            }
          } else {
            Object.keys(this.addForm.controls).forEach(field => {
              const control = this.addForm.get(field);
              if (control && control.invalid) {
                this.showSnackBar(`${field} is required`);
              }
            });
          }
        }
      }
    }
    getFileSizeKb(blob: Blob): number {
      return Math.ceil(blob.size / 1024); // Convert bytes to KB
    }
    async encodeFileContentFromBlob(blob: Blob): Promise<string> {
      // Convert Blob to ArrayBuffer
      const arrayBuffer = await blob.arrayBuffer();
      
      // Convert ArrayBuffer to Uint8Array
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert Uint8Array to binary string
      let binary = '';
      const len = uint8Array.byteLength;
      
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      
      // Convert binary string to Base64
      return btoa(binary);
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
export interface CustomFile {
  name: string;
  size: number;
  content: Uint8Array;
}
interface Tooth {
  id: number;
  vertices: { x: number; y: number }[];
}
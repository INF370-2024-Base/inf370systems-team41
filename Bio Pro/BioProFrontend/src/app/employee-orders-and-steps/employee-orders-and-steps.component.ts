import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaFileViewModel } from '../shared/SystemOrderViewModel ';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CustomFile } from '../orders-awaiting-dental-design/orders-awaiting-dental-design.component';
import { MatDialog } from '@angular/material/dialog';
import { StockData, StockUsedComponent } from '../stock-used/stock-used.component';
import { OrderService } from '../services/order.service';
import { AddStockItemViewModel } from '../shared/Stock';
import { StockServices } from '../services/stock.service';
import { DataService } from '../services/login.service';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-employee-orders-and-steps',
  templateUrl: './employee-orders-and-steps.component.html',
  styleUrls: ['./employee-orders-and-steps.component.scss']
})
export class EmployeeOrdersAndStepsComponent implements OnInit {
  editForm!: FormGroup;
  constructor(private employeeService:EmployeeService,private orderService:OrderService,private loginService:DataService, private stockService:StockServices, private formBuilder: FormBuilder,private sanitizer:DomSanitizer,private dialog:MatDialog) {this.editForm = this.formBuilder.group({
    MediaFiles: [null]
  }); }

  ngOnInit(): void {
    this.getCurrentOrders()
  }
  employeeEmail=JSON.parse(sessionStorage.getItem('Token')!).user
  orders:any[]=[]
   getCurrentOrders()
   {
    this.employeeService.GetCurrentOrders(this.employeeEmail).subscribe(result=>{
      console.log(result)
      this.orders=result
    },
  (error:HttpErrorResponse)=>
    {
      console.log(error.error)
    })

 }
 stockused:any[]=[]
 addEventClicked(event: any): void {
  const dialogRef = this.dialog.open(StockUsedComponent, {
    width: '600px',
    data:{ event }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.stockUsed=result
      if(this.stockUsed!=null)
      {this.stockUsed.StockUsed.forEach(element => {
        this.stockService.getStockById(element.StockId).subscribe(
          result=>
          {
            this.stockView.push(result)
          }
        )
      });
      console.log(this.stockUsed)
      console.log(result)}
    }
  });
  console.log('Event clicked:', event);
  console.log(this.stockUsed)
}
ClearStock(): void {
  this.stockUsed = {
    StockUsed: [],
    OrderId: ''
  };
}
uploadedFileUrls: { url: SafeUrl, name: string }[] = [];
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
errorsFound:boolean=false
mediaFileViewModels:MediaFileViewModel[]=[]
 CompleteStepOrOrder(stepId:number,orderId:string)
 {
  console.log(stepId)
  
  if(this.uploadedFiles.length>0)
    { 
        this.mediaFileViewModels = this.uploadedFiles.map(file => {
        const mediaFileViewModel = new MediaFileViewModel();
        mediaFileViewModel.FileName = file.name;
        mediaFileViewModel.FileSelf = this.encodeFileContent(file.content);
        mediaFileViewModel.FileSizeKb = file.size;
        mediaFileViewModel.SystemOrderId = orderId;
        return mediaFileViewModel;
        });
        const newMediaFile:AddMediaFileViewModel={
          mediaFileViewModels:this.mediaFileViewModels,
          orderId:orderId
        }
        this.orderService.addMediaFile(newMediaFile).subscribe(result=>
          {
            console.log(result)
            },(error:HttpErrorResponse)=>{
              console.log(error.error)
            }
        ) 

    }
    
  if(this.stockUsed!=null)
    {
      
      this.stockUsed.StockUsed.forEach(element => {
        if(this.stockUsed!=null)
        {const stockToSend:AddStockItemViewModel=
        {
          StockId:element.StockId,
          OrderId:this.stockUsed.OrderId,
          Quantity:element.Quantity
        }
        this.stockService.addStockItem(stockToSend).subscribe(result=>
          {
            console.log(result)
            },(error:HttpErrorResponse)=>{
              console.log(error)
              this.errorsFound=true;
            }
        )}
      });
      if(!this.errorsFound)
        {
          this.employeeService.CompleteStepAndJob(stepId).pipe(
            switchMap(result => {
              return this.employeeService.GetSystemOrderStepById(stepId).pipe(
                map(step => {
                  this.loginService.addTransaction("Put", `Completed step: ${step.description}. For order with id: ${step.systemOrderId}`);
                  console.log(result);
                  this.getCurrentOrders();
                  this.stockUsed = null
                  return result; // Or any other value you want to return
                })
              );
            })
          ).subscribe(
            result => {
             
            },
            error => {
              console.error(error);
            }
          );
      }
       
    }
    else{
      alert("Please pick stock used")
    }
 }
 stockView:any[]=[]
stockUsed!:StockData|null
uploadedFiles: CustomFile[]=[]
 
 onSubmit(orderId:string){
  
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
}
export class AddMediaFileViewModel
{
  mediaFileViewModels:MediaFileViewModel[]=[];
  orderId:string=''
}
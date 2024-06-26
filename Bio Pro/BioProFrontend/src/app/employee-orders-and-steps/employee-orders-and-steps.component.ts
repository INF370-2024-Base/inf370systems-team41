import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaFileViewModel } from '../shared/SystemOrderViewModel ';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CustomFile } from '../orders-awaiting-dental-design/orders-awaiting-dental-design.component';

@Component({
  selector: 'app-employee-orders-and-steps',
  templateUrl: './employee-orders-and-steps.component.html',
  styleUrls: ['./employee-orders-and-steps.component.scss']
})
export class EmployeeOrdersAndStepsComponent implements OnInit {
  editForm!: FormGroup;
  constructor(private employeeService:EmployeeService, private formBuilder: FormBuilder,private sanitizer:DomSanitizer) {this.editForm = this.formBuilder.group({
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
 CompleteStepOrOrder(stepId:number)
 {
  console.log(stepId)
  this.employeeService.CompleteStepAndJob(stepId).subscribe(result=>
    {
      console.log(result)
      this.getCurrentOrders()
      },(error:HttpErrorResponse)=>{
        console.log(error.error)
}
  )
 }
 uploadedFileUrls!: { url: SafeUrl, name: string }
  uploadedFiles!: CustomFile 
 
 onSubmit(orderId:string){
  
 }
}
export async function createMediaFile(orderId: string, file: File): Promise<MediaFileViewModel> {
  const mediaFileViewModel: MediaFileViewModel = {
    FileName: file.name,
    FileSelf: await encodeFileContent(file),
    FileSizeKb: file.size / 1024, // Convert bytes to kilobytes
    SystemOrderId: orderId,
  };
  return mediaFileViewModel;
}

async function encodeFileContent(file: File): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  return encodeArrayBuffer(arrayBuffer);
}

function encodeArrayBuffer(content: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(content);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  });
}




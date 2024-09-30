import { Component, ErrorHandler, OnInit, Sanitizer } from '@angular/core';
import { OrderService } from '../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MediaFileViewModel } from '../shared/SystemOrderViewModel ';
import { Router } from '@angular/router';
import { DataService } from '../services/login.service';

@Component({
  selector: 'app-orders-awaiting-dental-design',
  templateUrl: './orders-awaiting-dental-design.component.html',
  styleUrls: ['./orders-awaiting-dental-design.component.scss']
})
export class OrdersAwaitingDentalDesignComponent implements OnInit {
  addDentalDesign!: FormGroup;
  uploadedFileUrls!: { url: SafeUrl, name: string,orderID:string }
  uploadedFiles!: CustomFile 
  constructor(private router:Router,private orderService:OrderService,private loginService:DataService,private formBuilder: FormBuilder,private snackbar:MatSnackBar, private sanitizer:DomSanitizer) 
  {  this.addDentalDesign = this.formBuilder.group({
    MediaFiles: [null],
    OrderId:['', Validators.required]
  });}
ordersAwaitingDentalDesign:any[]=[]
  ngOnInit(): void {
   
    this.orderService.getOrdersAwaitingDentalDesign().subscribe(result=>
      {
        this.ordersAwaitingDentalDesign=result
        console.log(result)
      },
      (error:HttpErrorResponse)=>
        {
          console.log(error.error)
        }
    )
  }
  onFileSelected(event: any,orderId:string): void {
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

            this.uploadedFiles=({
                name: "DentalDesign",
                size: file.size,
                content: byteArray
            });
            console.log(this.uploadedFiles);
            this.uploadedFileUrls=({ url, name: file.name,orderID:orderId });
        };

        reader.readAsArrayBuffer(file);
    }
}
onSubmit(orderId:string): void {
  console.log(this.uploadedFiles)
  const viewModel = new AddDentalDesignViewModel();
  if (this.uploadedFiles!=null)
    {
      viewModel.DentalDesign.FileName = this.uploadedFiles.name
      viewModel.DentalDesign.FileSelf=this.encodeFileContent(this.uploadedFiles.content)
      viewModel.DentalDesign.FileSizeKb=this.uploadedFiles.size
      viewModel.DentalDesign.SystemOrderId=orderId

      viewModel.OrderId=orderId
      
      this.orderService.sendDentalDesign(viewModel).subscribe(
        result=>
          {
            this.loginService.addTransaction("Put","Sent dental design for approval for order with id:"+ viewModel.DentalDesign.SystemOrderId+".")
            this.showSnackBar("Successfully added dental design")
            this.router.navigate(['/orders']);
          }
          ,
          (error:HttpErrorResponse)=>
          {
            this.showSnackBar(error.error)
          }
      )

    }
    else {
            this.showSnackBar(`Please add dental design.`);
  }
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
showSnackBar(message:string) {
  this.snackbar.open(message, 'Dismiss', {
    duration: 3000, 
  });
}

}
export interface CustomFile {
  name: string;
  size: number;
  content: Uint8Array;
}
export class AddDentalDesignViewModel{
  OrderId:string="";
  DentalDesign!:MediaFileViewModel

  constructor() {
    this.DentalDesign = new MediaFileViewModel();
  }
}
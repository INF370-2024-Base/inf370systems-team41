import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DataService } from '../services/login.service';
import { EditMediaFileViewModel } from '../shared/SystemOrderViewModel ';
import { ResetUserPasswordComponent } from '../reset-user-password/reset-user-password.component';
import { editColourAndExportGltf } from '../shared/editTeethModel';

@Component({
  selector: 'app-dental-design-approval',
  templateUrl: './dental-design-approval.component.html',
  styleUrls: ['./dental-design-approval.component.scss']
})
export class DentalDesignApprovalComponent implements OnInit {

  constructor(private snackBar:MatSnackBar,private orderService:OrderService,private dialog:MatDialog,private loginService:DataService) { }
  pendingOrdersData:any[]=[]
  ngOnInit(): void {
      this.orderService.GetOrdersAwaitingDentalDesignApproval().subscribe(
        result=>
          {
            this.pendingOrdersData=result
            console.log(this.pendingOrdersData)
          },
          (error:HttpErrorResponse)=>
            {
              this.showSnackBar(error.error)
            }
      )
  }
  isImage(base64String: string): boolean {
    try {
      const binary = atob(base64String);
      const firstByte = binary.charCodeAt(0);
      const secondByte = binary.charCodeAt(1);
  
      // Check for PNG (89 50), JPEG (FF D8), GIF (47 49)
      if ((firstByte === 0x89 && secondByte === 0x50) || // PNG
          (firstByte === 0xFF && secondByte === 0xD8) || // JPEG
          (firstByte === 0x47 && secondByte === 0x49)) { // GIF
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }
  downloadFile(base64String: string, fileName: string) {
    const link = document.createElement('a');
    link.href = `data:application/octet-stream;base64,${base64String}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  deleteMediaFile(mediaFileId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
     width: '250px',
     data: 'Are you sure you want to delete this media file?'
   });

   dialogRef.afterClosed().subscribe(result => {
     if (result) {
       this.orderService.deleteMediaFile(mediaFileId).subscribe(
         () => {
           this.showSnackBar('Successfully deleted media file');
           setTimeout(() => {
             location.reload(); // Reload or update data as needed
           }, 2000); 
         },
         (error: HttpErrorResponse) => {
           console.error('Error deleting media file:', error.error);
         }
       );
     }
   });
 }
  getBase64ImageSrc(base64String: string): string {
    if (this.isImage(base64String)) {
      return `data:image/png;base64,${base64String}`;
    }
    return '';
  }
  showSnackBar(message:string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000, 
    });
  }
  approveOrder(order:any){
   
      this.orderService.get3DMediaFile(order.orderId).subscribe(async result=>{
        console.log(result)
        const toothModelContent= await editColourAndExportGltf(this.convertBase64ToFile(result.fileSelf,result.fileName),order.mouthArea,'#ADD8E6')
        const mediaFile:EditMediaFileViewModel=
        {
          MediaFileID:result.mediaFileId,
          FileName:result.fileName,
          FileSelf:await this.encodeFileContentFromBlob(toothModelContent),
          FileSizeKb:this.getFileSizeKb(toothModelContent)
        }
        this.orderService.editMediaFile(mediaFile).subscribe(
          result=>{
            this.orderService.apporveDentalDesign(order.orderId).subscribe(result=>{
              console.log(result)
            console.log(result)
            location.reload()
            this.loginService.addTransaction("Put","Approved dental design for order with id:"+ order.orderId+".")
          },error=>{
            console.log(error)
          }
        )
      })
    },
  (error:HttpErrorResponse)=>
  {
    this.showSnackBar('An error occured but the dental design will be approved.'+error.error)
    this.orderService.apporveDentalDesign(order.orderId).subscribe(result=>{
    console.log(result)
    console.log(result)
    location.reload()
    this.loginService.addTransaction("Put","Approved dental design for order with id:"+ order.orderId+".")
  },error=>{
    console.log(error)
  })
  }
  )
    }
    rejectOrder(orderId:number){
      this.orderService.rejectDentalDesign(orderId).subscribe(result=>{
        this.loginService.addTransaction("Put","Rejected dental design for order with id:"+ orderId+".")
        console.log(result)
        location.reload()
      })
     
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
      getFileSizeKb(blob: Blob): number {
        return Math.ceil(blob.size / 1024); // Convert bytes to KB
      }
      private convertBase64ToFile(base64String: string, fileName: string): File {
        // Decode the Base64 string to binary data
        const byteString = atob(base64String);
      
        // Convert the binary string to an array of 8-bit unsigned integers
        const byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteArray[i] = byteString.charCodeAt(i);
        }
      
        // Check if the file is binary (.glb) or text (.gltf) based on the extension
        const isBinary = fileName.endsWith('.glb');
        const mimeType = isBinary ? 'model/gltf-binary' : 'application/json';
      
        // Create a Blob from the byte array
        const blob = new Blob([byteArray], { type: mimeType });
      
        // Create and return a File from the Blob
        return new File([blob], fileName, { type: mimeType });
      }
}

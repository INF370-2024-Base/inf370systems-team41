import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DataService } from '../services/login.service';

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
  approveOrder(orderId:number){
    this.orderService.apporveDentalDesign(orderId).subscribe(result=>{
      console.log(result)
      location.reload()
      this.loginService.addTransaction("Put","Approved dental design for order with id:"+ orderId+".")

    },
  (error:HttpErrorResponse)=>
  {
    this.showSnackBar(error.error)
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

}

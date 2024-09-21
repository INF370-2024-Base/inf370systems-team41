import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../services/order.service';
import { switchMap,forkJoin,of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { MatDialog } from '@angular/material/dialog';
import { EditOrderModalComponent } from '../edit-order-modal/edit-order-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DataService } from '../services/login.service';
import { RoleGuardService } from '../services/roleCheck';
import { ModellingComponent } from '../modelling/modelling.component';
import { MediaFileViewModel } from '../shared/SystemOrderViewModel ';
import { eventNames } from 'process';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('cardHover', [
      state('rest', style({
        transform: 'translateY(0)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      })),
      state('hover', style({
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
      })),
      transition('rest <=> hover', animate('0.3s ease'))
    ])
  ]
})
export class OrdersComponent implements OnInit {
  hoverState: string = 'rest';
  orderId: string = '';
  orders: any[] = [];
  ordersInfo:any[]=[];
  selectedOrder: any = null;
  showStatusModal: boolean = false;
  selectedFilter:any
  orderTypes:any[]=[]
  selectedOrderForStatus: any = null;
  originalOrders:any[]=[]
  baseUrl: string ='https://localhost:44315/Api/';
  loading:boolean=true
  constructor(private router:Router,public roleService:RoleGuardService, private dialog: MatDialog,private http: HttpClient,private dataservices:OrderService,private snackBar:MatSnackBar,private loginService:DataService) { }

  ngAfterViewChecked(): void {

  }
  ngOnInit(): void {
    this.getOrdersAndInfo();
    this.getOrderTypes();
  }
  
  toggleHover(state: string) {
    this.hoverState = state;
  }
  selectedGltfFile!: File;
  openModelViewer(file: File, steps?:any): void {
    const fileUrl = URL.createObjectURL(file);
    this.router.navigate(['/model'], { queryParams: { fileUrl,steps: JSON.stringify(steps) } });
  }
    onFileSelected(event: any,steps?:any): void {
      console.log(event)
      const file:MediaFileViewModel= 
      {
        FileName:event.fileName,
        FileSelf:event.fileSelf,
        FileSizeKb:event.fileSizeKb,
        SystemOrderId:event.systemOrderId
      }
      if (file && file.FileName.endsWith('.gltf')) {
        this.selectedGltfFile = this.convertBase64ToFile(file.FileSelf,file.FileName);
        this.openModelViewer(this.selectedGltfFile,steps)
      } else {
        console.error('Invalid file type. Please upload a .gltf file.');
      }
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
  getOrdersAndInfo() {
    this.dataservices.getAllOrderInfo().subscribe(
      ((allOrders: any[]) => {
        if (Array.isArray(allOrders)) {
          this.orders = allOrders;
          this.originalOrders=allOrders
          this.loading=false
          this.ordersInfo=allOrders
          console.log(this.ordersInfo)
          
          
        } else {
          console.error('No orders found.');
        }
      })
    )
  }

  getOrderTypes() {
    this.dataservices.getOrderTypes().subscribe(results=>
      {
        this.orderTypes=results
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
getBase64ImageSrc(base64String: string): string {
  if (this.isImage(base64String)) {
    return `data:image/png;base64,${base64String}`;
  }
  return '';
}
downloadFile(base64String: string, fileName: string) {
  const link = document.createElement('a');
  link.href = `data:application/octet-stream;base64,${base64String}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  this.loginService.addTransaction("Exported","Exported mediafile "+fileName+".")
}

  clearSeacrhOrders() {
    this.orders= this.originalOrders
    this.orderId=""
    this.selectedFilter=0
    this.onFilterChange(null);
  }
  showSnackBar(Message:string) {
    this.snackBar.open(Message, 'Dismiss', {
      duration: 3000, 
    });
  }
  onOrderIdChange(newOrderId: string) {
    if (newOrderId.trim() === '') {
      this.ordersInfo = this.originalOrders;
    } else {
      this.ordersInfo = this.originalOrders.filter((d) => 
        d.orderId.toLowerCase().includes(newOrderId.toLowerCase())
      );
    }
  }
  
  editOrder(orderId: string): void {
    const selectedOrder = this.ordersInfo.find(order => order.orderId === orderId);
  console.log('Selected order for editing:', selectedOrder); // Debug log for selected order

  const dialogRef = this.dialog.open(EditOrderModalComponent, {
    data: { order: selectedOrder }
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result!="Order update canceled")
    {console.log(`Dialog result: ${result}`);
    this.closeModal();
     this.showSnackBar(result);
     setTimeout(() => {
      this.getOrdersAndInfo();
    }, 2000); 
    }
    else{
      this.showSnackBar(result);
    }
    
  
     
  });
}
  openStatusModal(order: any): void {
    this.selectedOrderForStatus = order;
    this.showStatusModal = true;
  }
  closeModal(): void {
    this.selectedOrder = null;
  }

  deleteOrder(orderId: string): void {
    console.log('Delete order:', orderId);
  }

  closeStatusModal(): void {
    this.selectedOrderForStatus = null;
    this.showStatusModal = false;
  }

  updateOrderStatus(newStatusId: number): void {
    if (this.selectedOrderForStatus) {
      this.selectedOrderForStatus.systemOrder.orderStatusId = newStatusId;
      this.dataservices.updateOrder(this.selectedOrderForStatus.systemOrder).subscribe(
        () => {
          console.log('Order status updated successfully');
          this.closeStatusModal();
          this.getOrdersAndInfo();
        },
        (error) => {
          console.error('Error updating order status:', error);
        }
      );
    }
  }
  onFilterChange(event: any) {
    console.log(this.selectedFilter);
  
    if (this.selectedFilter == 0) {
      this.ordersInfo = this.originalOrders;
    } else {
      this.ordersInfo = this.originalOrders.filter((d) => 
        d.orderType.orderTypeId == this.selectedFilter
      );
    }
    
    // Ensure the "No orders found" message is triggered
    if (this.ordersInfo.length === 0) {
      this.showSnackBar('No orders found.');
    }
  }
  
  deleteMediaFile(mediaFileId: number): void {
     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Are you sure you want to delete this media file?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservices.deleteMediaFile(mediaFileId).subscribe(
          () => {
            this.loginService.addTransaction("Delete","Deleted mediafile with ID:"+mediaFileId)
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
 cancelOrder(id:string)
 {
  const dialogRefCancel = this.dialog.open(ConfirmationDialogComponent, {
    width: '250px',
    data: 'Are you sure you want to cancel this order?'
  });

  dialogRefCancel.afterClosed().subscribe(result => {
    if (result) {
      // If the user confirms, delete the event
      this.dataservices.CancelOrder(id).subscribe(() => {
        this.loginService.addTransaction("Put","Cancelled an order. Order ID:"+id)
        console.log('Order canceled:');
        dialogRefCancel.close(true);
        this.showSnackBar('Canceled order:'+id)
        this.getOrdersAndInfo()
      }, error => {
        console.error('Error deleting order', error);
        this.showSnackBar('Error canceling order:'+error.error)
      });
    }
  });
 }
}




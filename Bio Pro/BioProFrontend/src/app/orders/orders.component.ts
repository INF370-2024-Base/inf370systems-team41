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
  constructor(private dialog: MatDialog,private http: HttpClient,private dataservices:OrderService,private snackBar:MatSnackBar) { }

  ngAfterViewChecked(): void {

  }
  ngOnInit(): void {
    this.getOrdersAndInfo();
  }
  
  toggleHover(state: string) {
    this.hoverState = state;
  }

  getOrdersAndInfo() {
    this.dataservices.getAllOrders().pipe(
      switchMap((allOrders: any[]) => {
        if (Array.isArray(allOrders)) {
          this.orders = allOrders;
          this.originalOrders=allOrders
          this.dataservices.getOrderTypes().subscribe(results=>
            {
              this.orderTypes=results
            }
          )
          return forkJoin(this.orders.map(order => this.dataservices.getAllOrderInfo(order.orderId)));
          
        } else {
          console.error('No orders found.');
          return of([]); // Empty observable
        }
      })
    ).subscribe(
      (orderInfos: any[]) => {
        this.ordersInfo = orderInfos;
        console.log('It works');
        console.log('Orders and order info retrieved:', this.orders, this.ordersInfo);
      },
      (error) => {
        console.error('Error fetching orders or order info:', error);
      }
    );
  }
  getOrderInfo()
  {
    this.ordersInfo=[]
    this.orders.forEach((order) => {
      console.log(order); 
      this.dataservices.getAllOrderInfo(order.orderId).subscribe(
        (result: any) => {
            this.ordersInfo.push(result);
                   },
        (error) => {
          console.error('Error fetching order info:', error);
        }
      );
    });
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
}
  searchOrders() {
    if (this.orderId.trim() !== '') {
      const url = `${this.baseUrl}GetOrdersById/${this.orderId}`;
      this.http.get<any>(url)
        .subscribe(
          (data) => {
            console.log(data)
            if (data) {
              this.ordersInfo=[]
              this.orders = [data]; 
              this.getOrderInfo()

            } else {
              this.ordersInfo=[]
              this.orders = [data]; 
              this.getOrderInfo() // Reset orders array if no data found
  
            }
          },
          (error:HttpErrorResponse) => {
            if (error.status === 404) {
              // Show the snackbar when a 404 error occurs
              this.showSnackBar('No orders');
            }
          }
        );
    } else {
      this.getOrderInfo()

    }
  }
  clearSeacrhOrders() {
    this.getOrdersAndInfo();
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
      this.getOrdersAndInfo()
      this.selectedFilter=0
      this.onFilterChange(null);
      
    } else {
      // Filter restaurants based on query
      this.orders = this.orders.filter((d) => d.orderId.toLowerCase().includes(newOrderId));
      this.getOrderInfo()

    }
  }
  editOrder(orderId: string): void {
    const selectedOrder = this.ordersInfo.find(order => order.systemOrder.orderId === orderId);
  console.log('Selected order for editing:', selectedOrder); // Debug log for selected order

  const dialogRef = this.dialog.open(EditOrderModalComponent, {
    data: { order: selectedOrder }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
    this.closeModal();
     this.showSnackBar(result);
     setTimeout(() => {
      location.reload();
    }, 2000); 
  
     
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
          this.getOrderInfo();
        },
        (error) => {
          console.error('Error updating order status:', error);
        }
      );
    }
  }
  onFilterChange(event: any)
  {
    console.log(this.selectedFilter)
    if (this.selectedFilter == 0) {
      this.orders=[...this.originalOrders]
      this.getOrderInfo()
    } else {
      this.orders=[...this.originalOrders]
      this.orders = this.orders.filter((d) => d.orderTypeId==this.selectedFilter);
      this.getOrderInfo()

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




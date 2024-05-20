import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../services/order.service';
import { switchMap,forkJoin,of } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { EditOrderModalComponent } from '../edit-order-modal/edit-order-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
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
  private isDrawing: boolean = false;
  ngAfterViewChecked(): void {
    if (this.ordersInfo.length > 0 && !this.isDrawing) {
      this.isDrawing = true;
      this.drawShapes();
      console.log("drawing");
      // setTimeout(() => {
      //   
      // }, 2000); 
    }

  }
  ngOnInit(): void {
    this.getOrdersAndInfo();
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
        this.isDrawing= false;
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
            this.isDrawing = false;
                   },
        (error) => {
          console.error('Error fetching order info:', error);
        }
      );
    });
  }
  drawShapes() {
    this.ordersInfo.forEach(order => {
        // Get the canvas corresponding to the current order
        let canvas = document.getElementById('myCanvas' + order.systemOrder.orderId) as HTMLCanvasElement;
        const img = new Image();
    img.src = 'assets/images/mouth area.png';
    img.onload = () => {
      if (canvas) {
        
        let ctx = canvas.getContext('2d')!;
        const scaleFactor = 0.3; 
          const desiredWidth = img.width * scaleFactor;
          const desiredHeight = img.height * scaleFactor;
          canvas.width = img.width* scaleFactor;
        canvas.height = img.height* scaleFactor;
          const offsetX = (canvas.width - desiredWidth) / 2; 
          const offsetY = (canvas.height - desiredHeight) / 2; 

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, offsetX, offsetY, desiredWidth, desiredHeight);
        
        for (const area of order.selectedAreas) {
            const { x, y, width, height } = area;
            const scaledX = x * scaleFactor + offsetX;
            const scaledY = y * scaleFactor + offsetY;
            const scaledWidth = width * scaleFactor;
            const scaledHeight = height * scaleFactor;
            ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
        }
    } else {
        console.error(`Canvas with id 'myCanvas${order.systemOrder.orderId}' not found`);
    }
    }
        // Ensure the canvas exists
       
    });
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
              this.isDrawing = false;

            } else {
              this.ordersInfo=[]
              this.orders = [data]; 
              this.getOrderInfo() // Reset orders array if no data found
              this.isDrawing = false;
  
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
 
}




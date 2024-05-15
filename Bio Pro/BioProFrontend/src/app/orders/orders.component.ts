import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orderId: string = '';
  orders: any[] = [];
  ordersInfo:any[]=[];
  baseUrl: string ='https://localhost:44315/Api/';
  constructor(private http: HttpClient,private dataservices:DataService) { }
  private isDrawing: boolean = false;
  ngOnInit(): void {
    
    this.dataservices.getAllOrders().subscribe(result => {
      let allOrders:any[] = result
      if(Array.isArray(allOrders))
      {
        allOrders.forEach((element) => {
        this.orders.push(element)
        this.getOrderInfo()
        });
      }
    })
    
    console.log(this.orders)
    
    console.log(this.ordersInfo)
   
  }
  ngAfterViewChecked(): void {
    if (this.ordersInfo.length > 0 && !this.isDrawing) {
      this.isDrawing = true;
      this.drawShapes();
    }

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
              this.orders = [data]; 
              this.getOrderInfo()// Assuming the response is a single order or array of orders
              this.isDrawing = false;
            } else {
              this.orders = []; // Reset orders array if no data found
            }
          },
          (error) => {
            console.error('Error fetching orders:', error);
            this.orders = []; // Reset orders array on error
          }
        );
    } else {
      this.orders = []; // Reset orders array if search input is empty
    }
  }
}




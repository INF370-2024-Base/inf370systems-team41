import { Component, OnInit } from '@angular/core';
import { StockServices } from '../services/stock.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { EditStockTypeComponent } from '../edit-stock-type/edit-stock-type.component';
import { AddStockTypeComponent } from '../add-stock-type/add-stock-type.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-type',
  templateUrl: './stock-type.component.html',
  styleUrls: ['./stock-type.component.scss']
})
export class StockTypeComponent implements OnInit {


    constructor(private stockService:StockServices,private dialog: MatDialog,private snackBar:MatSnackBar) { }
  
    ngOnInit(): void {
  this.GetAllStockTypes();
    }
    AllStockTypes:any[]=[]
    displayedStockTypes: any[] = [];
    searchTerm:string=''
    GetAllStockTypes()
    {
        this.stockService.getAllStockTypes().subscribe(result => {
          this.AllStockTypes = result;
          this.displayedStockTypes = result;
          console.log(this.AllStockTypes);
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      );
    }
    eventClicked(type: any): void {
      const dialogRef = this.dialog.open(EditStockTypeComponent, {
        width: '300px',
        data: { type }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.GetAllStockTypes();
        }
      });
    }
    addType(): void {
      const dialogRef = this.dialog.open(AddStockTypeComponent, {
        width: '300px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.GetAllStockTypes();
        }
      });
    }
    deleteType(id: number): void {
      const confirmdialog = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
        data: 'Are you sure you want to delete this type?'
      });
    
      confirmdialog.afterClosed().subscribe(result => {
        if (result) {
          this.stockService.DeleteStockType(id).subscribe(() => {
            this.GetAllStockTypes();
            console.log('Deleted type');
            this.snackBar.open('Deleted type successfully', 'Dismiss', {
              duration: 3000,
            });
          }, error => {
            console.error('Error deleting type', error);
          });
        }
      });
    }
    filteredStockTypes() {
      if (this.searchTerm === '') {
        this.displayedStockTypes = this.AllStockTypes;
      } else {
        this.displayedStockTypes = this.AllStockTypes.filter((type) =>
          type.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
    }
}
  


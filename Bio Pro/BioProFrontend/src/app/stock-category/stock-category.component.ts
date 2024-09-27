import { Component, OnInit } from '@angular/core';
import { StockServices } from '../services/stock.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditStockCategoryComponent } from '../edit-stock-category/edit-stock-category.component';
import { AddStockCategoryComponent } from '../add-stock-category/add-stock-category.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/login.service';

@Component({
  selector: 'app-stock-category',
  templateUrl: './stock-category.component.html',
  styleUrls: ['./stock-category.component.scss']
})
export class StockCategoryComponent implements OnInit {
  

  constructor(private stockService:StockServices,private dialog: MatDialog,private snackBar:MatSnackBar,private loginService:DataService) { }

  ngOnInit(): void {
this.GetAllStockCategories();
  }
  searchTerm: string = '';
  AllStockCategories:any[]=[]
  displayedStockCategories: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  GetAllStockCategories()
  {
      this.stockService.getAllStockCategories().subscribe(result => {
        this.AllStockCategories = result;
        this.displayedStockCategories=result
        console.log(this.AllStockCategories);
        this.filteredStockCategories(); 
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }
  eventClicked(category: any): void {
    const dialogRef = this.dialog.open(EditStockCategoryComponent, {
      width: '300px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.GetAllStockCategories();
      }
    });
  }
  addCategory(): void {
    const dialogRef = this.dialog.open(AddStockCategoryComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.GetAllStockCategories();
      }
    });
  }
  
  deleteCategory(id: number): void {
    const confirmdialog = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Are you sure you want to delete this category?'
    });
  
    confirmdialog.afterClosed().subscribe(result => {
      if (result) {
        this.stockService.DeleteStockCategory(id).subscribe(() => {
          this.GetAllStockCategories();
          this.loginService.addTransaction("Deleted","Deleted stock category with id: "+id)
          console.log('Deleted category');
          this.snackBar.open('Deleted category successfully', 'Dismiss', {
            duration: 3000,
          });
        }, error => {
          console.error('Error deleting category', error);
        });
      }
    });
  }
  get paginatedStockCategories(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.displayedStockCategories.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.displayedStockCategories.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  filteredStockCategories() {
    if (this.searchTerm === '') {
      this.displayedStockCategories = this.AllStockCategories;
    } else {
      this.displayedStockCategories = this.AllStockCategories.filter((category) =>
        category.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
  }
}

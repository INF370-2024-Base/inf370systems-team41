import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../services/login.service';

@Component({
  selector: 'app-reject-order-modal',
  templateUrl: './reject-order-modal.component.html',
  styleUrls: ['./reject-order-modal.component.scss']
})
export class RejectOrderModalComponent {
  rejectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RejectOrderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number },
    private orderService: OrderService,
    private snackBar: MatSnackBar,private loginService:DataService
  ) {
    this.rejectForm = this.fb.group({
      justification: ['', Validators.required],
      decisionLogState: ['Rejected']
    });
  }

  onSubmit(): void {
    if (this.rejectForm.valid) {
      const formData = this.rejectForm.value;
      const decision = {
        Justification: formData.justification,
        DateOfDecision: new Date(),
        DecisionLogState: formData.decisionLogState,
        SystemOrderId: this.data.orderId
      };
      this.orderService.dissaprovePendingOrders(this.data.orderId).subscribe(
        result => {
          this.orderService.AddDecision(decision).subscribe(
            () => {
              this.snackBar.open('Order rejected successfully!', 'Dismiss', { duration: 3000 });
              this.loginService.addTransaction("Put","Rejected an order. Order ID:"+this.data.orderId)
              this.dialogRef.close(true);
            },
            error => {
              this.snackBar.open('Error adding decision: ' + error.error, 'Dismiss', { duration: 3000 });
            }
          );
        },
        error => {
          this.snackBar.open('Error rejecting order: ' + error.error, 'Dismiss', { duration: 3000 });
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

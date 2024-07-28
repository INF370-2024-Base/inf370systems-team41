import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { CalendarEvent } from 'angular-calendar';
import { CalendarService } from '../services/calendar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditCalanderEventViewModel } from '../shared/EditCalanderEvent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.scss']
})
export class AddEventModalComponent implements OnInit {
  isEditMode = false;
  addForm:FormGroup
  constructor(
    public dialogRef: MatDialogRef<EventModalComponent>,
    private calendarService: CalendarService,private snackBar:MatSnackBar,private dialog: MatDialog,private fb:FormBuilder
  ) {this.addForm = this.fb.group({
    Description: ['', Validators.required],
    EventInformation: ['', Validators.required],
    DateOfEvent:['', Validators.required],
    Time:['', Validators.required]
  });}
  addEvent:EditCalanderEventViewModel={
    Id:0,
    EventInformation:'',
    CalanderScheduleEventDateTime:new Date(),
   Description:''
  }
  time:string='00:00'
  ngOnInit(): void {
    console.log(this.addEvent)
  }
  SubmitForm() {
    if(this.addEvent.EventInformation==''||this.addEvent.Description=='')
      {
        this.showSnackBar("Please give event title and description")
      }
      else
            {
              this.addEvent.CalanderScheduleEventDateTime = this.combineDateAndTime(this.addEvent.CalanderScheduleEventDateTime, this.time);
            const adjustedDateOfEvent = new Date(this.addEvent.CalanderScheduleEventDateTime.setHours(this.addEvent.CalanderScheduleEventDateTime.getHours() + 2))
          this.calendarService.addCalendarEvent(this.addEvent).subscribe(() => {
          this.dialogRef.close(true);
        }, error => {
          console.error('Error updating event', error);
        });
        }
  }

  combineDateAndTime(date: Date, time: any): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes);
    console.log(combinedDate)
    return combinedDate;
  }
  showSnackBar(message:string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000, 
    });
  }
  
}

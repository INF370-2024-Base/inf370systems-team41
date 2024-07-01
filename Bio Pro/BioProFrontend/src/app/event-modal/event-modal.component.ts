import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { CalendarService } from '../services/calendar.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditCalanderEventViewModel } from '../shared/EditCalanderEvent';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit {
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: CalendarEvent },
    private calendarService: CalendarService,private snackBar:MatSnackBar,private dialog: MatDialog
  ) {}
selectedEvent:EditEvent=
{
  DateOfEvent:this.data.event.start,
  TimeOfEvent:this.data.event.start.getHours()+":"+this.data.event.start.getMinutes(),
  TitleOfEvent:this.data.event.title,
}
  ngOnInit(): void {
    console.log(this.data)
    this.selectedEvent=
{
  DateOfEvent:this.data.event.start,
  TimeOfEvent:this.data.event.start.getHours()+":"+this.data.event.start.getMinutes(),
  TitleOfEvent:this.data.event.title,
}
  }
  toggleEditMode(): void {
    if (this.isEditMode) {
      if(this.selectedEvent.DateOfEvent==null||this.selectedEvent.TitleOfEvent==''||this.selectedEvent.TimeOfEvent=='')
        {
          this.selectedEvent=
            {
              DateOfEvent:this.data.event.start,
              TimeOfEvent:this.data.event.start.getHours()+":"+this.data.event.start.getMinutes(),
              TitleOfEvent:this.data.event.title,
            }
            this.showSnackBar("Please fill in all input fields")

        }
        else{
          this.selectedEvent.DateOfEvent=this.combineDateAndTime(this.selectedEvent.DateOfEvent,this.selectedEvent.TimeOfEvent)
          this.isEditMode = !this.isEditMode;
          const eventToEdit:EditCalanderEventViewModel={
            Id:this.data.event.object.calanderScheduleEventId,
            Description:this.selectedEvent.TitleOfEvent,
            CalanderScheduleEventDateTime:this.selectedEvent.DateOfEvent
            
          }
         this.calendarService.updateCalendarEvent(eventToEdit).subscribe(() => {
        console.log('Event updated:', this.data.event);
        this.dialogRef.close(true);
      }, error => {
        console.error('Error updating event', error);
      });

        }
 
    }
    else{
      this.isEditMode = !this.isEditMode;
    }
    
    console.log(this.selectedEvent)
  }
  combineDateAndTime(date: Date, time: any): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes);
    return combinedDate;
  }
  onDateChange(date: Date): void {
    // Update the date part of the event object
    this.selectedEvent.DateOfEvent = date;
    this.selectedEvent.DateOfEvent = this.combineDateAndTime(date, this.selectedEvent.TimeOfEvent);
  }
  showSnackBar(message:string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000, 
    });
  }
  deleteEvent(): void {
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Are you sure you want to delete this event?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If the user confirms, delete the event
        this.calendarService.deleteCalendarEvent(this.data.event.object.calanderScheduleEventId).subscribe(() => {
          console.log('Event deleted:', this.selectedEvent);
          this.dialogRef.close(true);
        }, error => {
          console.error('Error deleting event', error);
        });
      }
    });
  }
}
class EditEvent{
  TitleOfEvent:string='';
  DateOfEvent:Date=new Date();
  TimeOfEvent:string='';
}


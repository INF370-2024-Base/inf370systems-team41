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
  EventInformation:this.data.event.Object.information

}
  ngOnInit(): void {
    console.log(this.data)
    const minutes:string=this.data.event.start.getMinutes().toString().padStart(2, '0');
    const hours:string=this.data.event.start.getHours().toString().padStart(2, '0');
    
    this.selectedEvent=
{
  DateOfEvent:this.data.event.start,
  TimeOfEvent:this.data.event.start.getHours()+":"+this.data.event.start.getMinutes(),
  TitleOfEvent:this.data.event.title,
  EventInformation:this.data.event.Object.information
}
if(this.data.event.start.getHours()<10)
  {
    this.selectedEvent.TimeOfEvent=hours+':'+this.data.event.start.getMinutes();
  }
  if(this.data.event.start.getMinutes()<10)
    {
      this.selectedEvent.TimeOfEvent=this.selectedEvent.TimeOfEvent.substring(0,2)+':'+minutes
    }
console.log(this.selectedEvent)
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
              EventInformation:this.data.event.Object.information
            }
            this.showSnackBar("Please fill in all input fields")

        }
        else{
          this.isEditMode = !this.isEditMode;
          
          this.selectedEvent.DateOfEvent = this.combineDateAndTime(this.selectedEvent.DateOfEvent, this.selectedEvent.TimeOfEvent);
          const adjustedDateOfEvent = new Date(this.selectedEvent.DateOfEvent.setHours(this.selectedEvent.DateOfEvent.getHours() + 2))
          const eventToEdit:EditCalanderEventViewModel={
            Id:this.data.event.Object.calanderScheduleEventId,
            Description:this.selectedEvent.TitleOfEvent,
            CalanderScheduleEventDateTime:new Date(adjustedDateOfEvent),
            EventInformation:this.selectedEvent.EventInformation
          }
          console.log('Event updated:', eventToEdit.CalanderScheduleEventDateTime);
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
    
    
  }
  combineDateAndTime(date: Date, time: any): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes);
    console.log(combinedDate)
    return combinedDate;
  }
  onDateChange(date: Date): void {
    // Update the date part of the event object
    // this.selectedEvent.DateOfEvent = date;
    // this.selectedEvent.DateOfEvent = this.combineDateAndTime(date, this.selectedEvent.TimeOfEvent);
    // console.log(this.selectedEvent.DateOfEvent)
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
        this.calendarService.deleteCalendarEvent(this.data.event.Object.calanderScheduleEventId).subscribe(() => {
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
  EventInformation:string='';
}


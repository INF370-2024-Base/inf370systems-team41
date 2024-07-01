import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-procededural-timeline-view',
  templateUrl: './procededural-timeline-view.component.html',
  styleUrls: ['./procededural-timeline-view.component.scss']
})
export class ProcededuralTimelineViewComponent implements OnInit {

  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<ProcededuralTimelineViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: CalendarEvent },
  ) {}
  ngOnInit(): void {
    console.log(this.data)
  }
}

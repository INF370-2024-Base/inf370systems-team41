export interface AddCalanderEventViewModel {
  CalanderScheduleEventDateTime: Date;
  Description: string;
  }
 export const dummyEvents: AddCalanderEventViewModel[] = [
    {
      CalanderScheduleEventDateTime: new Date('2024-06-28T20:58:11'),
      Description: 'Event 1',
    },
    {
      CalanderScheduleEventDateTime: new Date('2024-06-29T20:58:11'),
      Description: 'Event 2',
    },
    {
      CalanderScheduleEventDateTime: new Date('2024-06-30T20:58:11'),
      Description: 'Event 3',
    },
    {
      CalanderScheduleEventDateTime: new Date('2024-07-01T20:58:11'),
      Description: 'Event 4',
    },
    {
      CalanderScheduleEventDateTime: new Date('2024-07-02T20:58:11'),
      Description: 'Event 5',
    },
  ];
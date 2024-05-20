import { AbstractControl, ValidatorFn } from '@angular/forms';

export class DateValidator {

  static dateGreaterThanToday(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate: Date = new Date(control.value);
      const today: Date = new Date();

      // Check if the selected date is greater than today's date
      if (selectedDate <= today) {
        return { 'dateGreaterThanToday': true };
      }
      return null;
    };
  }
}
export class PhoneChecker {
    static SouthAfricanPhoneNumberValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const phoneNumberRegex = /^[0-9]{10}$/; // South African phone numbers are typically 10 digits long
          const phoneNumber = control.value;
      
          if (!phoneNumberRegex.test(phoneNumber)) {
            return { 'invalidPhoneNumber': true };
          }
          return null;
        };
  }
}
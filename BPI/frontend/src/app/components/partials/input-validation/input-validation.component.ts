import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const VALIDATORS_MESSAGES:any = {
  required:'This field is required',
  email:'Invalid email format',
  minlength:'Field is too short',
  maxlength:'Field is too long',
  notMatch:'Passwords do not match'
}

@Component({
  selector: 'input-validation',
  templateUrl: './input-validation.component.html',
  styleUrl: './input-validation.component.css'
})
export class InputValidationComponent implements OnInit, OnChanges {

  checkValidation() {
    const errors = this.control.errors;

    if(!errors) {
      this.errorMessages = [];
      return;
    }

    const errorKeys = Object.keys(errors);
    this.errorMessages = errorKeys.map(key => VALIDATORS_MESSAGES[key]);
  }

  @Input() control!:AbstractControl;
  @Input() showErrorsWhen:boolean = true;

  errorMessages: string[] = [];

  ngOnInit(): void {
    this.control.statusChanges.subscribe(() => {
      this.checkValidation();
    });

    this.control.valueChanges.subscribe(() => {
      this.checkValidation();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkValidation();
  }
}

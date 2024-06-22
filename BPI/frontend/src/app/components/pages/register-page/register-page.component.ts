import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { PasswordsMatchValidator } from '../../../shared/validators/password_match_validator';
import { IUserRegister } from '../../../shared/interface/IUserRegister';
import { OrganizationService } from '../../../services/organization.service';
import { Organization } from '../../../shared/models/Organization';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  registerForm!: FormGroup;
  isSubmitted = false;

  returnUrl = '';

  organizations!: Organization[];

  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private userService: UserService,
    private organizationService: OrganizationService
  ) {
    this.organizationService.getAll().subscribe(orgs => {
      this.organizations = orgs;
    });
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [
        Validators.required,
        Validators.maxLength(50),
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(50),
      ]],
      username: ['', [
        Validators.required,
        Validators.maxLength(50),
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
      ]],
      confirmedPassword: ['', [
        Validators.required
      ]],
      assignedTo: [null, [
        Validators.required
      ]]
    }, {
      validators: PasswordsMatchValidator('password', 'confirmedPassword')
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit() {
    this.isSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const fv = this.registerForm.value;

    const user: IUserRegister = {
      firstName: fv.firstName,
      lastName: fv.lastName,
      username: fv.username,
      email: fv.email,
      password: fv.password,
      confirmedPassword: fv.confirmedPassword,
      assignedTo: fv.assignedTo,
      roleScope: 'user'
    };

    this.userService.register(user).subscribe(_ => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
  
}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { ROLES_SCOPES } from '../../../shared/constants/all_about_models';
import { INewUser } from '../../../shared/interface/INewUser';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordsMatchValidator } from '../../../shared/validators/password_match_validator';
import { IEditUser } from '../../../shared/interface/IEditUser';

@Component({
  selector: 'app-userform-page',
  templateUrl: './userform-page.component.html',
  styleUrl: './userform-page.component.css'
})
export class UserformPageComponent implements OnInit {

  @Input() isForCreate = true;

  userForm!: FormGroup;
  isSubmitted = false;
  user!: User;

  roles = ROLES_SCOPES;

  nrSelect='';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  ngOnInit(): void {
    this.isForCreate = this.activatedRoute.snapshot.data['isForCreate'];
    this.initializeForm();
  }

  initializeForm(): void {
    if (!this.isForCreate) {
      this.userForm = this.fb.group({
        firstName: [this.user.firstName, [
          Validators.minLength(3),
          Validators.maxLength(100)
        ]],
        lastName: [this.user.lastName, [
          Validators.minLength(3),
          Validators.maxLength(100)
        ]],
        email: [this.user.email, [
          Validators.email
        ]],
        password: ['', [
          Validators.minLength(6)
        ]],
        confirmedPassword: ['', [
          Validators.minLength(6)
        ]],
      }, {
        validators: PasswordsMatchValidator('password', 'confirmedPassword')
      });
    } else {
      this.userForm = this.fb.group({
        firstName: ['', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]],
        lastName: ['', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]],
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        roleScope: ['', [
          Validators.required
        ]],
        assignedTo: ['', [
          Validators.required
        ]]
      });
    }
  }

  get fc() {
    return this.userForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }

    if(this.isForCreate) {
      const fv = this.userForm.value;

      const user: INewUser = {
        firstName: fv.firstName,
        lastName: fv.lastName,
        email: fv.email,
        roleScope: fv.roleScope,
        assignedTo: fv.assignedTo
      };

      this.userService.create(user).subscribe(_ => {
        this.router.navigateByUrl(`users`);
      });
    } else {
      const fv = this.userForm.value;

      const user: IEditUser = {
        firstName: fv.firstName,
        lastName: fv.lastName,
        email: fv.email,
        password: fv.password
      };

      this.userService.edit(user).subscribe(_ => {
        this.router.navigateByUrl(``);
      });
    }
  }
}

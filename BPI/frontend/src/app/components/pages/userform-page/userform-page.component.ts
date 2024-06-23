import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { ROLES_SCOPES } from '../../../shared/constants/all_about_models';
import { INewUser } from '../../../shared/interface/INewUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userform-page',
  templateUrl: './userform-page.component.html',
  styleUrl: './userform-page.component.css'
})
export class UserformPageComponent implements OnInit {
  userForm!: FormGroup;
  isSubmitted = false;
  user!: User;

  roles = ROLES_SCOPES;

  nrSelect='';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.min(3),
        Validators.max(100)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.min(3),
        Validators.max(100)
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

  get fc() {
    return this.userForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }

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
  }
}

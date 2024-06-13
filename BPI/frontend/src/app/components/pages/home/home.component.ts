import { Component } from '@angular/core';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../services/user.service';
import { ROLES_SCOPES } from '../../../shared/constants/all_about_models';

const ADMIN = ROLES_SCOPES[0];
const ORGANIZATION = ROLES_SCOPES[1];
const USER = ROLES_SCOPES[2];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  user!:User;

  constructor(private userService:UserService) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  get isAuth() {
    return this.user.token;
  }

  get isAdmin() {
    return this.user.roleScope === ADMIN;
  }

  get isOrganization() {
    return this.user.roleScope === ORGANIZATION;
  }

  get isUser() {
    return this.user.roleScope === USER;
  }

}

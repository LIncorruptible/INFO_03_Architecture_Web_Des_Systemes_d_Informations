import { Component } from '@angular/core';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../services/user.service';
import { ROLES_SCOPES } from '../../../shared/constants/all_about_models';

const ADMIN = ROLES_SCOPES[0];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user!:User;

  constructor(private userService:UserService) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  logout() {
    this.userService.logout();
  }

  get isAuth() {
    return this.user.token;
  }

  get isAdmin() {
    return this.user.roleScope === ADMIN;
  }
}

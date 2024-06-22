import { Component } from '@angular/core';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../services/user.service';
import { ROLES_SCOPES } from '../../../shared/constants/all_about_models';

const ADMIN = ROLES_SCOPES[0];

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {
  user!: User;
  users!: User[];

  constructor(
    userService: UserService
  ) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    userService.usersObservable.subscribe((newUsers) => {
      this.users = newUsers;
    });
  }

  get isAdmin(): boolean {
    return this.user.roleScope === ADMIN;
  }

  get numberOfUsers(): number {
    if (this.users) {
      return this.users.length;
    }

    return 0;
  }
}

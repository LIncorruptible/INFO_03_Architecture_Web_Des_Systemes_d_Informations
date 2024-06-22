import { Component } from '@angular/core';
import { User } from '../../../../shared/models/User';
import { UserService } from '../../../../services/user.service';
import { ROLES_SCOPES } from '../../../../shared/constants/all_about_models';
import { Router } from '@angular/router';
import { Organization } from '../../../../shared/models/Organization';

const ADMIN = ROLES_SCOPES[0];

@Component({
  selector: 'user-table',
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  user! : User;
  users! : User[];

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    this.userService.usersObservable.subscribe((newUsers) => {
      this.users = newUsers;
    });
  }

  get isAdmin(): boolean {
    return this.user.roleScope === ADMIN;
  }

  itsMe(user: User): boolean {
    return this.user.id === user.id;
  }

  targetIsAdmin(user: User): any {
    return user.roleScope === ADMIN;
  }

  create() {
  }
  
  inventory(user: User) {
    this.router.navigateByUrl(`/inventory/${user.id}`);
  }

  edit(user: User) {
    console.log('Edit user');
  }

  remove(user: User) {
    this.userService.remove(user).subscribe((newUsers) => {
      this.users = newUsers;
    });
  }

  resetFilters() {
    this.users = this.userService.users.sort((a, b) => a.id.localeCompare(b.id));
  }

  sortByUserField(field: keyof User) {
    this.users.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }
  
      return String(aValue).localeCompare(String(bValue));
    });
  }

  sortByOrganizationField(field: keyof Organization) {
    this.users.sort((a, b) => {
      const aValue = a.assignedTo ? a.assignedTo[field] : '';
      const bValue = b.assignedTo ? b.assignedTo[field] : '';
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }
  
      return String(aValue).localeCompare(String(bValue));
    });
  }

  filterByUserField(field: keyof User, value: string) {
    this.resetFilters();

    this.users = this.users.filter((user) => {
      const userValue = user[field];
      return String(userValue).includes(value);
    });
  }
}

import { Component } from '@angular/core';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../services/user.service';

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
}

import { Component } from '@angular/core';
import { User } from '../../../shared/models/User';
import { Request as RequestModel } from '../../../shared/models/Request';
import { UserService } from '../../../services/user.service';
import { RequestService } from '../../../services/request.service';
import { ROLES_SCOPES } from '../../../shared/constants/all_about_models';

const ADMIN = ROLES_SCOPES[0];

@Component({
  selector: 'app-requests-page',
  templateUrl: './requests-page.component.html',
  styleUrl: './requests-page.component.css'
})
export class RequestsPageComponent {
  user!: User;
  requests!: RequestModel[];

  constructor(
    private userService: UserService,
    private requestService: RequestService
  ) {
    this.user = this.userService.currentUser();

    this.requestService.getAccordingToCurrentUser().subscribe((newRequests) => {
      this.requests = newRequests;
    });
  }

  get isAdmin(): boolean {
    return this.user.roleScope === ADMIN;
  }

  get numberOfRequests(): number {
    if (this.requests) {
      return this.requests.length;
    }

    return 0;
  }
}

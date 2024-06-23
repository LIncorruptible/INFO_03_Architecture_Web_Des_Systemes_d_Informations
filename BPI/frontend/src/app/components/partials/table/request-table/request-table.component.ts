import { Component } from '@angular/core';
import { Request as RequestModel } from '../../../../shared/models/Request';
import { Material } from '../../../../shared/models/Material';
import { User } from '../../../../shared/models/User';
import { MaterialService } from '../../../../services/material.service';
import { RequestService } from '../../../../services/request.service';
import { UserService } from '../../../../services/user.service';
import { REQUEST_STATUS, ROLES_SCOPES } from '../../../../shared/constants/all_about_models';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

const ADMIN = ROLES_SCOPES[0];

const DEFAULT_SELECTED_CHOICE = "ALL";

const PENDING = REQUEST_STATUS[0];

@Component({
  selector: 'request-table',
  templateUrl: './request-table.component.html',
  styleUrl: './request-table.component.css'
})
export class RequestTableComponent {
  user!: User;
  requests!: RequestModel[];

  status: string[] = REQUEST_STATUS;
  selectedStatus: string = DEFAULT_SELECTED_CHOICE;
  selecterControl: FormControl = new FormControl();

  constructor(
    private userService: UserService,
    private requestService: RequestService,
    private materialService: MaterialService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = this.userService.currentUser();

    this.requestService.getAccordingToCurrentUser().subscribe((newRequests) => {
      this.requests = newRequests;
    });

    this.selecterControl.reset(DEFAULT_SELECTED_CHOICE);
  }

  get isAdmin() {
    return this.user.roleScope === ADMIN;
  }

  isPending(request: RequestModel) {
    return request.status === PENDING;
  }

  remove(request: RequestModel) {
    this.requestService.remove(request).subscribe(() => {
      this.requests = this.requests.filter((r) => r.id !== request.id);
    })
  }

  sortByRequestField(field: keyof RequestModel) {
    this.requests.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return aValue.getTime() - bValue.getTime();
      }
  
      return String(aValue).localeCompare(String(bValue));
    });
  }

  sortByMaterialField(field: keyof Material) {
    this.requests.sort((a, b) => {
      const aValue = a.material[field];
      const bValue = b.material[field];
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }
  
      return String(aValue).localeCompare(String(bValue));
    });
  }

  resetFilters() {
    this.requestService.getAccordingToCurrentUser().subscribe((newRequests) => {
      this.requests = newRequests;
    });

    this.selecterControl.reset(DEFAULT_SELECTED_CHOICE);
  }

  getEventTargetValue($event: Event) {
    return ($event.target as HTMLInputElement).value;
  }

  getStatusSelection($event: Event) {
    this.selectedStatus = this.getEventTargetValue($event);
    this.filterByAllSelections();
  }

  filterByAllSelections() {
    this.requestService.getAccordingToCurrentUser().subscribe((newRequests) => {
      this.requests = newRequests.filter((request) => {
        return this.filterByStatus(request);
      });
    });
  }

  filterByStatus(request: RequestModel) {
    if (this.selectedStatus === DEFAULT_SELECTED_CHOICE) {
      return true;
    }

    return request.status === this.selectedStatus;
  }

  reject(request: RequestModel) {
    this.requestService.reject(request).subscribe((rejectedRequest) => {
      this.requests = this.requests.map((r) => {
        if (r.id === rejectedRequest.id) {
          return rejectedRequest;
        }
        return r;
      });
    });
  }

  approve(request: RequestModel) {
    this.requestService.approve(request).subscribe((updatedRequest) => {
      this.requests = this.requests.map((r) => {
        if (r.id === updatedRequest.id) {
          return updatedRequest;
        }
        return r;
      });
    });
  }

}
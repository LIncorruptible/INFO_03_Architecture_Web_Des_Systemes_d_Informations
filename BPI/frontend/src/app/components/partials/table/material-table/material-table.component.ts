import { Component, Input, OnInit } from '@angular/core';
import { Material } from '../../../../shared/models/Material';
import { MaterialService } from '../../../../services/material.service';
import { UserService } from '../../../../services/user.service';
import { REQUEST_TYPES, ROLES_SCOPES } from '../../../../shared/constants/all_about_models';
import { User } from '../../../../shared/models/User';
import { RequestService } from '../../../../services/request.service';
import { Request as RequestModel } from '../../../../shared/models/Request';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

const ADMIN = ROLES_SCOPES[0];

const ASSIGNMENT = REQUEST_TYPES[0];
const RETURN = REQUEST_TYPES[1];

@Component({
  selector: 'material-table',
  templateUrl: './material-table.component.html',
  styleUrl: './material-table.component.css'
})
export class MaterialTableComponent implements OnInit {

  remove(_t16: Material) {
    throw new Error('Method not implemented.');
  }

  assign(_t16: Material) {
    throw new Error('Method not implemented.');
  }

  askForRefund(material: Material) {
    this.requestService.askFor(material, this.user, RETURN).subscribe({
      next: (request) => {
        this.requestService.updateRequestsSubject([...this.requests, request]);
      },
      error: (errorResponse) => {
      }
    });
  }

  edit(material: Material) {
    throw new Error('Method not implemented.');
  }

  refund(material: Material) {
    throw new Error('Method not implemented.');
  }

  user!: User;
  materials!: Material[];
  requests!: RequestModel[];
  requestsSubscription!: Subscription;

  constructor(
    private materialService: MaterialService,
    private userService: UserService,
    private requestService: RequestService
  ) {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    this.materialService.materialsObservable.subscribe((newMaterials) => {
      this.materials = newMaterials;
    });    
  }

  ngOnInit(): void {
    this.requestsSubscription = this.requestService.requests.subscribe((newRequests) => {
      this.requests = newRequests;
    });
  }

  ngOnDestroy(): void {
    this.requestsSubscription.unsubscribe();
  }

  get isAdmin(): boolean {
    return this.userService.currentUser().roleScope === ADMIN;
  }
  
  isAlreadyRequested(material: Material): boolean {
    return this.requestService.isAlreadyRequested(material);
  }
}

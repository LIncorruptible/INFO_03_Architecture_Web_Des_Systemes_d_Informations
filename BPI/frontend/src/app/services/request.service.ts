import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Request as RequestModel } from '../shared/models/Request';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { URLS } from '../shared/constants/urls';
import { User } from '../shared/models/User';
import { Organization } from '../shared/models/Organization';
import { REQUEST_STATUS, REQUEST_TYPES, ROLES_SCOPES } from '../shared/constants/all_about_models';
import { Material } from '../shared/models/Material';
import { ToastrService } from 'ngx-toastr';

const ADMIN = ROLES_SCOPES[0];
const ORGANIZATION = ROLES_SCOPES[1];

const ASSIGNMENT = REQUEST_TYPES[0];
const RETURN = REQUEST_TYPES[1];

const PENDING = REQUEST_STATUS[0];

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  user!: User;
  
  requests!: RequestModel[];
  requestsObservable: Observable<RequestModel[]> = new Observable<RequestModel[]>();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private toastrService: ToastrService
  ) {
    this.user = this.userService.currentUser();
  }

  getAll(): Observable<RequestModel[]> {
    return this.http.get<RequestModel[]>(URLS.REQUESTS.BASE);
  }

  getByOrganization(organization: Organization): Observable<RequestModel[]> {
    return this.http.get<RequestModel[]>(URLS.REQUESTS.BY_ORGANIZATION + organization.id);
  }

  getByUser(user: User): Observable<RequestModel[]> {
    return this.http.get<RequestModel[]>(URLS.REQUESTS.BY_REQUESTER + user.id);
  }

  getByMaterial(material: Material): Observable<RequestModel[]> {
    return this.http.get<RequestModel[]>(URLS.REQUESTS.BY_MATERIAL + material.id);
  }
  
  getAccordingToCurrentUser(): Observable<RequestModel[]> {
    if (this.user.roleScope === ADMIN) 
      return this.getAll();
    else if (this.user.roleScope === ORGANIZATION) 
      return this.getByOrganization(this.user.assignedTo);
    else 
      return this.getByUser(this.user);
  }

  askFor = (material: Material, user: User, type: string): Observable<RequestModel> => {
    return this.http.post<RequestModel>(
      URLS.REQUESTS.ADD,
      {
        requester: user.id,
        material: material.id,
        type: type
      }
    ).pipe(
      tap({
        next: (request) => {
          this.toastrService.success('Request sent');
        },
        error: (errorResponse) => {
          this.toastrService.error(
            'Request failed' 
            + ' ' + (errorResponse as HttpErrorResponse).error.message
          );
        }
      })
    );
  }

  remove = (request: RequestModel): Observable<RequestModel> => {
    return this.http.delete<RequestModel>(
      URLS.REQUESTS.DELETE + request.id
    ).pipe(
      tap({
        next: (request) => {
          this.toastrService.success('Request removed');
        },
        error: (errorResponse) => {
          this.toastrService.error(
            'Request removal failed' 
            + ' ' + (errorResponse as HttpErrorResponse).error.message
          );
        }
      })
    );
  
  }

  isAlreadyRequested(material: Material): boolean {
    if (this.requests) {
      return this.requests.some((request) => request.material.id === material.id && request.status === PENDING);
    }
    return false;
  }

  approve = (request: RequestModel): Observable<RequestModel> => {
    return this.http.get<RequestModel>(
      URLS.REQUESTS.APPROVE + request.id
    ).pipe(
      tap({
        next: (request) => {
          this.toastrService.success('Request approved');
        },
        error: (errorResponse) => {
          this.toastrService.error(
            'Request approval failed' 
            + ' ' + (errorResponse as HttpErrorResponse).error.message
          );
        }
      })
    );
  }

  reject = (request: RequestModel): Observable<RequestModel> => {
    return this.http.get<RequestModel>(
      URLS.REQUESTS.REJECT + request.id
    ).pipe(
      tap({
        next: (request) => {
          this.toastrService.success('Request rejected');
        },
        error: (errorResponse) => {
          this.toastrService.error(
            'Request rejection failed' 
            + ' ' + (errorResponse as HttpErrorResponse).error.message
          );
        }
      })
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from '../shared/models/Organization';
import { URLS } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Organization[]> {
    return this.http.get<Organization[]>(URLS.ORGANIZATIONS.BASE);
  }
}

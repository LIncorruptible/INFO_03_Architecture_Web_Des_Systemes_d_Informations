import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from '../shared/models/Tag';
import { Material } from '../shared/models/Material';
import { URLS } from '../shared/constants/urls';
import { User } from '../shared/models/User';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Organization } from '../shared/models/Organization';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private http:HttpClient, private userService: UserService) { }

  getAll(): Observable<Material[]> {
    return this.http.get<Material[]>(URLS.MATERIALS.BASE);
  }

  getByTag(tag: Tag): Observable<Material[]> {
    return this.http.get<Material[]>(URLS.MATERIALS.BY_TAG + tag);
  }

  getBySearch(searchTerm: string): Observable<Material[]> {
    return this.http.get<Material[]>(URLS.MATERIALS.BY_SEARCH + searchTerm);
  }

  getByUser(user: User): Observable<Material[]> {
    return this.http.get<Material[]>(URLS.MATERIALS.BY_USER + user);
  }

  getByOrganization(organization: Organization): Observable<Material[]> {
    return this.http.get<Material[]>(URLS.MATERIALS.BY_ORGANIZATION + organization);
  }

  getAccordingToCurrentUser(): Observable<Material[]> {
    const currentUser = this.userService.currentUser();

    if (currentUser.roleScope === "admin") 
      return this.getAll();
    else if (currentUser.roleScope === "organization") 
      return this.getByOrganization(currentUser.assignedTo);
    else 
      return this.getByUser(currentUser);
  }
}

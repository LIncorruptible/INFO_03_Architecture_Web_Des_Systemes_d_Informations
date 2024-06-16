import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from '../shared/models/Tag';
import { Material } from '../shared/models/Material';
import { URLS } from '../shared/constants/urls';
import { User } from '../shared/models/User';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Organization } from '../shared/models/Organization';
import { ROLES_SCOPES } from '../shared/constants/all_about_models';

const ADMIN = ROLES_SCOPES[0];
const ORGANIZATION = ROLES_SCOPES[1];
const USER = ROLES_SCOPES[2];

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  materials!: Material[];
  materialsObservable: Observable<Material[]> = new Observable<Material[]>();

  constructor(private http:HttpClient, private userService: UserService) {   
    this.materialsObservable = this.getAccordingToCurrentUser();

    this.materialsObservable.subscribe((newMaterials) => {
      this.materials = newMaterials;
    });
  }

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
    const currentUser: User = this.userService.currentUser();

    if (currentUser.roleScope === ADMIN) 
      return this.getAll();
    else if (currentUser.roleScope === ORGANIZATION) 
      return this.getByOrganization(currentUser.assignedTo);
    else 
      return this.getByUser(currentUser);
  }

  assign(material: Material): Observable<Material> {
    return this.http.put<Material>(URLS.MATERIALS.ASSIGN + material.id, material);
  }

  refund(material: Material): Observable<Material> {
    return this.http.put<Material>(URLS.MATERIALS.REFUND + material.id, material);
  }
}

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

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  user!: User;
  materials!: Material[];
  materialsObservable: Observable<Material[]> = new Observable<Material[]>();

  constructor(private http:HttpClient, private userService: UserService) {   
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    this.materialsObservable = this.getAccordingToCurrentUser();

    this.materialsObservable.subscribe((newMaterials) => {
      this.materials = newMaterials;
    });
  }

  getAll(): Observable<Material[]> {
    return this.http.get<Material[]>(URLS.MATERIALS.BASE);
  }

  getByTag(tag: Tag): Observable<Material[]> {
    return this.http.get<Material[]>(URLS.MATERIALS.BY_TAG + tag.id);
  }

  getByUser(user: User): Observable<Material[]> {
    return this.http.get<Material[]>(URLS.MATERIALS.BY_USER + user.id);
  }

  getByOrganization(organization: Organization): Observable<Material[]> {
    return this.http.get<Material[]>(URLS.MATERIALS.BY_ORGANIZATION + organization.id);
  }

  getAccordingToCurrentUser(): Observable<Material[]> {
    if (this.user.roleScope === ADMIN) 
      return this.getAll();
    else if (this.user.roleScope === ORGANIZATION) 
      return this.getByOrganization(this.user.assignedTo);
    else 
      return this.getByUser(this.user);
  }

  assign(material: Material): Observable<Material> {
    return this.http.put<Material>(URLS.MATERIALS.ASSIGN + material.id, material);
  }

  refund(material: Material): Observable<Material> {
    return this.http.put<Material>(URLS.MATERIALS.REFUND + material.id, material);
  }
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from '../shared/models/Tag';
import { Material } from '../shared/models/Material';
import { URLS } from '../shared/constants/urls';
import { User } from '../shared/models/User';
import { forkJoin, Observable, tap } from 'rxjs';
import { Organization } from '../shared/models/Organization';
import { MATERIAL_STATUS, ROLES_SCOPES } from '../shared/constants/all_about_models';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

const ADMIN = ROLES_SCOPES[0];
const ORGANIZATION = ROLES_SCOPES[1];
const STOCKED = MATERIAL_STATUS[0];

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  materials!: Material[];
  materialsObservable: Observable<Material[]> = new Observable<Material[]>();

  constructor(
    private http:HttpClient,
    private toastrService:ToastrService
  ) {   
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

  getAccordingToUserRoleScope(user: User): Observable<Material[]> {
    if (user.roleScope === ADMIN) {
      return this.getAll();
    }

    if (user.roleScope === ORGANIZATION) {
      return this.getByOrganization(user.assignedTo);
    }

    return this.getByUser(user);
  }

  assign(material: Material): Observable<Material> {
    return this.http.put<Material>(
      URLS.MATERIALS.ASSIGN + material.id, material
    ).pipe(
      tap(
        {
          next: (material) => {
            this.toastrService.success("Material assigned successfully");
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.toastrService.error(
              'Material assignment failed ' 
              + (errorResponse as HttpErrorResponse).error.message
            );
          }
        }
      )
    );
  }

  refund(material: Material): Observable<Material> {
    return this.http.put<Material>(
      URLS.MATERIALS.REFUND + material.id, material
    ).pipe(
      tap(
        {
          next: (material) => {
            this.toastrService.success("Material refunded successfully");
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.toastrService.error(
              'Material refund failed ' 
              + (errorResponse as HttpErrorResponse).error.message
            );
          }
        }
      )
    );
  }

  remove(material: Material): Observable<Material> {
    return this.http.delete<Material>(
      URLS.MATERIALS.DELETE + material.id
    ).pipe(
      tap(
        {
          next: (material) => {
            this.toastrService.success("Material removed successfully");
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.toastrService.error(
              'Material deletion failed ' 
              + (errorResponse as HttpErrorResponse).error.message
          );
          }
        }
      )
    );
  }
}

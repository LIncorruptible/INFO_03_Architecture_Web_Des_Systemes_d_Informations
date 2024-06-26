import { Component, Input, OnInit } from '@angular/core';
import { Material } from '../../../../shared/models/Material';
import { MaterialService } from '../../../../services/material.service';
import { UserService } from '../../../../services/user.service';
import { MATERIAL_STATUS, REQUEST_TYPES, ROLES_SCOPES } from '../../../../shared/constants/all_about_models';
import { User } from '../../../../shared/models/User';
import { RequestService } from '../../../../services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '../../../../shared/models/Tag';
import { TagService } from '../../../../services/tag.service';
import { FormControl } from '@angular/forms';

const ADMIN = ROLES_SCOPES[0];

const RETURN = REQUEST_TYPES[1];
const ASSIGNMENT = REQUEST_TYPES[0];

const DEFAULT_SELECTED_CHOICE = "ALL";

const STOCKED = MATERIAL_STATUS[0];
const USED = MATERIAL_STATUS[1];

@Component({
  selector: 'material-table',
  templateUrl: './material-table.component.html',
  styleUrl: './material-table.component.css'
})
export class MaterialTableComponent {

  user!: User;

  targetName: string = DEFAULT_SELECTED_CHOICE;

  materials!: Material[];

  selectedTag: string = DEFAULT_SELECTED_CHOICE;
  selectedStatus: string = DEFAULT_SELECTED_CHOICE;
  selectedForOrganization: string = DEFAULT_SELECTED_CHOICE;

  tags!: Tag[];
  status: string[] = MATERIAL_STATUS;
  forOrganization: boolean[] = [true, false];
  
  selecterControl: FormControl = new FormControl();

  constructor(
    private materialService: MaterialService,
    private userService: UserService,
    private requestService: RequestService,
    private tagService: TagService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });   

    this.tagService.tagsObservable.subscribe((newTags) => {
      this.tags = newTags.sort((a, b) => a.name.localeCompare(b.name));
    });

    this.activatedRoute.params.subscribe((params) => {
      this.userService.getById(params['id']).subscribe((targetUser) => {
        this.materialService.getAccordingToUserRoleScope(targetUser).subscribe((newMaterials) => {
          this.materials = newMaterials;
          this.targetName = (
            targetUser.roleScope === ADMIN
          ) ? "ALL" 
          : targetUser.firstName + ' ' + targetUser.lastName + ' inventory (' + targetUser.roleScope + ')';
        });
      });
    });

    this.requestService.getAccordingToCurrentUser().subscribe((newRequests) => {
      this.requestService.requests = newRequests;
    });

    this.selecterControl.reset(DEFAULT_SELECTED_CHOICE);
  }

  get isAdmin(): boolean {
    return this.userService.currentUser().roleScope === ADMIN;
  }
  
  isAlreadyRequested(material: Material): boolean {
    return this.requestService.isAlreadyRequested(material);
  }

  isStocked(material: Material): boolean {
    return material.status !== USED;
  }

  create() {
    throw new Error('Method not implemented.');
  }


  remove(material: Material) {
    this.materialService.remove(material).subscribe(() => {
      this.materials = this.materials.filter((m) => m.id !== material.id);
    });
  }

  isAssignable(material: Material): boolean {
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getById(params['id']).subscribe((targetUser) => {
        return this.materialService.isAssignable(material, targetUser);
      });
    });

    return false;
  }

  assign(material: Material) {
    const userId = this.activatedRoute.snapshot.params['id'];
    if (userId) {
      this.userService.getById(userId).subscribe((targetUser) => {
        this.materialService.assign(material, targetUser).subscribe((updatedMaterial) => {
          this.materials = this.materials.map((m) => {
            if (m.id === updatedMaterial.id) {
              return updatedMaterial;
            }
            return m;
          });
        });
      });
    } else {
      this.route.navigateByUrl('/users');
    }
  }

  request(material: Material) {
    this.requestService.askFor(material, this.user, ASSIGNMENT).subscribe((request) => {
      this.requestService.getAccordingToCurrentUser().subscribe((newRequests) => {
        this.requestService.requests = newRequests;
      });
    });
  }
    
  askForRefund(material: Material) {
    this.requestService.askFor(material, this.user, RETURN).subscribe((request) => {
      this.requestService.getAccordingToCurrentUser().subscribe((newRequests) => {
        this.requestService.requests = newRequests;
      });
    });
  }

  edit(material: Material) {
    throw new Error('Method not implemented.');
  }

  refund(material: Material) {
    this.materialService.refund(material).subscribe((updatedMaterial) => {
      this.materials = this.materials.map((m) => {
        if (m.id === updatedMaterial.id) {
          return updatedMaterial;
        }

        return m;
      });
    });
  }

  resetFilters() {
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getById(params['id']).subscribe((targetUser) => {
        this.materialService.getAccordingToUserRoleScope(targetUser).subscribe((newMaterials) => {
          this.materials = newMaterials;
        });
      });
    });

    this.selecterControl.reset(DEFAULT_SELECTED_CHOICE);
  }

  sortByMaterialField(field: keyof Material) {
    this.materials.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }
  
      return String(aValue).localeCompare(String(bValue));
    });
  }

  sortByTagField(field: keyof Tag) {
    this.materials.sort((a, b) => {
      const aValue = a.taggedAs[field];
      const bValue = b.taggedAs[field];
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }
  
      return String(aValue).localeCompare(String(bValue));
    });
  }

  getEventTargetValue($event: Event) {
    return ($event.target as HTMLInputElement).value;
  }

  getTagSelection($event: Event) {
    this.selectedTag = this.getEventTargetValue($event);
    this.filterByAllSelections();
  }

  getStatusSelection($event: Event) {
    this.selectedStatus = this.getEventTargetValue($event);
    this.filterByAllSelections();
  }

  getForOrganizationSelection($event: Event) {
    this.selectedForOrganization = this.getEventTargetValue($event);
    this.filterByAllSelections();
  }

  filterByAllSelections() {
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getById(params['id']).subscribe((targetUser) => {
        this.materialService.getAccordingToUserRoleScope(targetUser).subscribe((newMaterials) => {
          this.materials = newMaterials.filter((material) => {
            return this.filterByTag(material) && this.filterByStatus(material) && this.filterByForOrganization(material);
          });
        });
      });
    });
  }

  filterByTag(material: Material) {
    if (this.selectedTag === DEFAULT_SELECTED_CHOICE) {
      return true;
    }

    return material.taggedAs.name === this.selectedTag;
  }

  filterByStatus(material: Material) {
    if (this.selectedStatus === DEFAULT_SELECTED_CHOICE) {
      return true;
    }

    return material.status === this.selectedStatus;
  }

  filterByForOrganization(material: Material) {
    if (this.selectedForOrganization === DEFAULT_SELECTED_CHOICE) {
      return true;
    }

    return material.forOrganization === (this.selectedForOrganization === 'true' ? true : false);
  }

}

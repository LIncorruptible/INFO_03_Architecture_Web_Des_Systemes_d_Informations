import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MaterialService } from '../../../services/material.service';
import { User } from '../../../shared/models/User';
import { Material } from '../../../shared/models/Material';
import { ROLES_SCOPES } from '../../../shared/constants/all_about_models';

const ADMIN = ROLES_SCOPES[0];

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrl: './inventory-page.component.css'
})
export class InventoryPageComponent {

  user!: User;
  materials!: Material[];

  constructor(
    materialService: MaterialService,
    userService: UserService
  ) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    materialService.materialsObservable.subscribe((newMaterials) => {
      this.materials = newMaterials;
    });
  }

  get isAdmin(): boolean {
    return this.user.roleScope === ADMIN;
  }
}

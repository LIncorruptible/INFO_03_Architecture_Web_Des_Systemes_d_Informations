import { Component } from '@angular/core';
import { MaterialService } from '../../../services/material.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { ROLES_SCOPES } from '../../../shared/constants/all_about_models';
import { Material } from '../../../shared/models/Material';

const ADMIN = ROLES_SCOPES[0];

@Component({
  selector: 'material-table',
  templateUrl: './material-table.component.html',
  styleUrl: './material-table.component.css'
})
export class MaterialTableComponent {

  user!: User;
  materials!: Material[];
  
  selectedMaterial!: Material;

  constructor(
    private userService: UserService,
    private materialService: MaterialService
  ) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    materialService.materialsObservable.subscribe((newMaterials) => {
      this.materials = newMaterials;
    });
  }

  get isAdmin() {
    return this.user.roleScope === ADMIN;
  }

  get isAuth() {
    return this.user.token;
  }

  onMaterialSelect(material: Material) {
    this.selectedMaterial = material;
  }

  askFor() {}

  refund() {}

  addMaterial() {}

  editMaterial() {}

  deleteMaterial() {}
}

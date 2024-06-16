import { Component, Input, OnInit } from '@angular/core';
import { Material } from '../../../../shared/models/Material';
import { MaterialService } from '../../../../services/material.service';
import { UserService } from '../../../../services/user.service';
import { ROLES_SCOPES } from '../../../../shared/constants/all_about_models';
import { User } from '../../../../shared/models/User';

const ADMIN = ROLES_SCOPES[0];

@Component({
  selector: 'material-table',
  templateUrl: './material-table.component.html',
  styleUrl: './material-table.component.css'
})
export class MaterialTableComponent {
remove(_t16: Material) {
throw new Error('Method not implemented.');
}
assign(_t16: Material) {
throw new Error('Method not implemented.');
}
askForRefund(_t16: Material) {
throw new Error('Method not implemented.');
}

  edit(material: Material) {
    throw new Error('Method not implemented.');
  }

  refund(material: Material) {
    throw new Error('Method not implemented.');
  }

  user!: User;
  materials!: Material[];

  constructor(
    private materialService: MaterialService,
    private userService: UserService
  ) {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    this.materialService.materialsObservable.subscribe((newMaterials) => {
      this.materials = newMaterials;
    });
  }

  get isAdmin(): boolean {
    return this.userService.currentUser().roleScope === ADMIN;
  }
}

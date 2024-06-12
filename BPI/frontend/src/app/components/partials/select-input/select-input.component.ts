import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { OrganizationService } from '../../../services/organization.service';
import { UserService } from '../../../services/user.service';
import { MaterialService } from '../../../services/material.service';
import { TagService } from '../../../services/tag.service';
import { MODELS_NAMES } from '../../../shared/constants/all_about_models';

@Component({
  selector: 'select-input',
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.css'
})
export class SelectInputComponent implements OnInit {
  @Input() control!: AbstractControl;
  @Input() showErrorsWhen: boolean = true;
  @Input() label!: string;
  @Input() typeObj: 'user' | 'material' | 'organization' | 'tag' | 'any' = 'any';
  @Input() viewValue: string = 'Nothing to show';

  nrSelect='';
  
  selectObjectsList: any[] = [];

  constructor(
    private organizationService: OrganizationService,
    private userService: UserService,
    private materialService: MaterialService,
    private tagService: TagService,
  ) {}

  ngOnInit() {
    switch (this.typeObj) {
      case MODELS_NAMES.USER:
        this.userService.getAll().subscribe(users => {
          this.selectObjectsList = users;
        });
        break;
      case MODELS_NAMES.MATERIAL:
        this.materialService.getAll().subscribe(materials => {
          this.selectObjectsList = materials;
        });
        break;
      case MODELS_NAMES.ORGANIZATION:
        this.organizationService.getAll().subscribe(orgs => {
          this.selectObjectsList = orgs;
        });
        break;
      case MODELS_NAMES.TAG:
        this.tagService.getAll().subscribe(tags => {
          this.selectObjectsList = tags;
        });
        break;
    }
  }

  get formControl() {
    return this.control as FormControl;
  }

}

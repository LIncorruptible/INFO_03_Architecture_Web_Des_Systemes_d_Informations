import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialService } from '../../../services/material.service';
import { Material } from '../../../shared/models/Material';
import { MATERIAL_STATUS } from '../../../shared/constants/all_about_models';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/models/User';
import { INewMaterial } from '../../../shared/interface/INewMaterial';

@Component({
  selector: 'app-materialform-page',
  templateUrl: './materialform-page.component.html',
  styleUrl: './materialform-page.component.css'
})
export class MaterialformPageComponent implements OnInit {
  materialForm!: FormGroup;
  isSubmitted = false;
  user!: User;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  ngOnInit(): void {
    this.materialForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.min(3),
        Validators.max(100)
      ]],
      taggedAs: ['', [
        Validators.required
      ]],
      forOrganization: [false]
    });
  }
  
  get fc() {
    return this.materialForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.materialForm.invalid) {
      return;
    }

    const fv = this.materialForm.value;

    const material: INewMaterial = {
      name: fv.name,
      taggedAs: fv.taggedAs,
      forOrganization: fv.forOrganization
    };

    this.materialService.create(material).subscribe(_ => {
      this.router.navigateByUrl(`inventory/${this.user.id}`);
    })
  }
}

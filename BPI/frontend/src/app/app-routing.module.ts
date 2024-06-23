import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { InventoryPageComponent } from './components/pages/inventory-page/inventory-page.component';
import { UsersPageComponent } from './components/pages/users-page/users-page.component';
import { RequestsPageComponent } from './components/pages/requests-page/requests-page.component';
import { MaterialformPageComponent } from './components/pages/materialform-page/materialform-page.component';
import { UserformPageComponent } from './components/pages/userform-page/userform-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'register', component: RegisterPageComponent},
  { path: 'inventory/:id', component: InventoryPageComponent},
  { path: 'users', component: UsersPageComponent},
  { path: 'users/search/:searchTerm', component: UsersPageComponent},
  { path: 'requests', component: RequestsPageComponent},
  { path: 'materials/add', component: MaterialformPageComponent},
  { path: 'users/add', component: UserformPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

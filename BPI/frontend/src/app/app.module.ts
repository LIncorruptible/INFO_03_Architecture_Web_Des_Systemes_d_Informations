import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultButtonComponent } from './components/partials/default-button/default-button.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { ToastrModule } from 'ngx-toastr';
import { InputContainerComponent } from './components/partials/input-container/input-container.component';
import { InputValidationComponent } from './components/partials/input-validation/input-validation.component';
import { LoadingComponent } from './components/partials/loading/loading.component';
import { loadingInterceptor } from './shared/interceptors/loading.interceptor';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { TagsComponent } from './components/partials/tags/tags.component';
import { TextInputComponent } from './components/partials/text-input/text-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TitleComponent } from './components/partials/title/title.component';
import { SearchComponent } from './components/partials/search/search.component';
import { HomeComponent } from './components/pages/home/home.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { SelectInputComponent } from './components/partials/select-input/select-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserHomeComponent } from './components/partials/home/user-home/user-home.component';
import { OrganizationHomeComponent } from './components/partials/home/organization-home/organization-home.component';
import { AdminHomeComponent } from './components/partials/home/admin-home/admin-home.component';
import { GuestHomeComponent } from './components/partials/home/guest-home/guest-home.component';
import { InventoryPageComponent } from './components/pages/inventory-page/inventory-page.component';
import { MaterialTableComponent } from './components/partials/table/material-table/material-table.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultButtonComponent,
    HeaderComponent,
    InputContainerComponent,
    InputValidationComponent,
    LoadingComponent,
    NotFoundComponent,
    TagsComponent,
    TextInputComponent,
    TitleComponent,
    SearchComponent,
    HomeComponent,
    RegisterPageComponent,
    LoginPageComponent,
    SelectInputComponent,
    UserHomeComponent,
    OrganizationHomeComponent,
    AdminHomeComponent,
    GuestHomeComponent,
    InventoryPageComponent,
    MaterialTableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
      newestOnTop: false
    })
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptors([loadingInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

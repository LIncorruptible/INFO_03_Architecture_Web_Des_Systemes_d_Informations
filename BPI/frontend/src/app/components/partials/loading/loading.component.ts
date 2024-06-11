import { Component } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  isLoading!: boolean;

  constructor(loaderService: LoadingService) {
    loaderService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    //loaderService.showLoading();
  }
}

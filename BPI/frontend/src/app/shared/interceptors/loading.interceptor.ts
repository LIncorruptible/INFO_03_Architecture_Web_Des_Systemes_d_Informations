import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { tap } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.showLoading();
  return next(req).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
        loadingService.hideLoading();
      }
    })
  );
};

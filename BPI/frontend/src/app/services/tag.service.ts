import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLS } from '../shared/constants/urls';
import { Observable } from 'rxjs';
import { Tag } from '../shared/models/Tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http:HttpClient) { }

  getAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(URLS.TAGS.BASE);
  }
}

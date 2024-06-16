import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLS } from '../shared/constants/urls';
import { Observable } from 'rxjs';
import { Tag } from '../shared/models/Tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  tagsObservable: Observable<Tag[]> = new Observable<Tag[]>();

  constructor(private http:HttpClient) {
    this.tagsObservable = this.getAll();
   }

  getAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(URLS.TAGS.BASE);
  }

  getById(id: string): Observable<Tag> {
    return this.http.get<Tag>(URLS.TAGS.BY_ID + id);
  }
}

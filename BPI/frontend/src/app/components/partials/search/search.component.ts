import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  
  searchTerm: string = '';
  @Input() searchIn!: string;

  constructor(route:ActivatedRoute, private router: Router) {
    route.params.subscribe(params => {
      if(params['searchTerm']) {
        this.searchTerm = params['searchTerm'];
      }
    });
  }

  search(term:string):void {
    this.router.navigate([`${this.searchIn}/search/${term}`]);
  }
}

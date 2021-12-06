import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-search-page',
  templateUrl: './new-search-page.component.html',
  styleUrls: ['./new-search-page.component.scss']
})
export class NewSearchPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick(data: any): void {
    this.router.navigate(['/search'], { queryParams: { query: data } });
  }
}

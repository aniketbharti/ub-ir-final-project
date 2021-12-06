import { Component, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})

export class SearchPageComponent implements OnInit {
  public display: Number = 1;
  public sect : Number = 1;
  constructor() { 
    console.log('search page component' + this.display);
  }

  ngOnInit(): void {
  }
  changeDisplay(mode :Number) :void{
    this.display = mode;
  }

  changeSect(mode :Number) :void{
    this.sect = mode;
  }
  
}

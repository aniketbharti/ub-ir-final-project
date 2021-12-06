import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-search-page',
  templateUrl: './new-search-page.component.html',
  styleUrls: ['./new-search-page.component.scss']
})
export class NewSearchPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onClick(data:String) : void {
    console.log('form submitted'  + data);
  }
}

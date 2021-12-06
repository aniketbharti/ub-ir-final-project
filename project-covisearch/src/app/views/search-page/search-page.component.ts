import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})

export class SearchPageComponent implements OnInit {
  public display: Number = 1;
  public sect: Number = 1;
  query: any
  newList: any[] = [];
  searchResultPOI: any[] = [];
  searchResultNonPOI: any[] = [];

  constructor(private httpService: HttpService, private activedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activedRoute.queryParams
      .subscribe(params => {
        this.query = params['query']
        this.httpService.postMethod(environment.news, { query: this.query }).subscribe((res) => {
          this.newList = res
          console.log(this.newList)
        })
        this.httpService.postMethod(environment.search, { query: this.query }).subscribe((res) => {
          this.searchResultNonPOI = []
          this.searchResultPOI = []
          res['response']['docs'].forEach((element: any) => {
            if ('poi_name' in element) {
              this.searchResultPOI.push(element)
            }
            else {
              this.searchResultNonPOI.push(element)
            }
          })
        })
      }
      );
  }



  // country: "USA"
  // id: "1440753313801068554"
  // mentions: ['WHOIraq']
  // replied_to_user_id: 982219486248910800
  // score: 3.657134
  // sentiments: {polarity: 0, sentiment: 'Neutral', subjectivity: 0}
  // text_en: "daily COVID-19 epidemic situation in Iraq 22 September 2021"
  // tweet_date: "2021-09-22T19:00:00Z"
  // tweet_lang: "en"
  // tweet_text: "@WHOIraq daily COVID-19 epidemic situation in Iraq\n22 September 2021 https://t.co/ckYc6veFYN"
  // verified: true
  // _version_: 1718369006134493200

  changeDisplay(mode: Number): void {
    this.display = mode;
  }

  changeSect(mode: Number): void {
    this.sect = mode;
  }

}

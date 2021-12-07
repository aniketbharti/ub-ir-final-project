import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash'

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
          this.newList = res['response']
          this.newList.forEach((element) => {
            delete element['sentiments']['compound']
            let data = _(element['sentiments'])
              .toPairs()
              .orderBy([1], ['desc'])
              .fromPairs()
              .value()
            let key = Object.keys(data)[0]
            let displaySentiment = null
            if (key == 'neu') {
              displaySentiment = ['Neutral', data[key]]
            } else if (key == 'neg') {
              displaySentiment = ['Negative', data[key]]
            } if (key == 'pos') {
              displaySentiment = ['Postive', data[key]]
            }
            element['display'] = displaySentiment
          })
          console.log(this.newList)
        })
        this.httpService.postMethod(environment.search, { query: this.query }).subscribe((res) => {
          this.searchResultNonPOI = []
          this.searchResultPOI = []
          res['response']['docs'].forEach((element: any) => {
            delete element['sentiments']['compound']
            let data = _(element['sentiments'])
              .toPairs()
              .orderBy([1], ['desc'])
              .fromPairs()
              .value()
            let key = Object.keys(data)[0]
            let displaySentiment = null
            if (key == 'neu') {
              displaySentiment = ['Neutral', data[key]]
            } else if (key == 'neg') {
              displaySentiment = ['Negative', data[key]]
            } if (key == 'pos') {
              displaySentiment = ['Postive', data[key]]
            }
            element['display'] = displaySentiment
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

  changeDisplay(mode: Number): void {
    this.display = mode;
  }

  changeSect(mode: Number): void {
    this.sect = mode;
  }

}

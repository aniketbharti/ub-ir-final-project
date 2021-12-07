import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash'
import { forkJoin } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { GraphDataConverterService } from 'src/app/services/graph.data.converter.service';

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
  selectedChip: Number = 0;
  searchResultPOI: any[] = [];
  searchResultNonPOI: any[] = [];
  state: boolean = false;
  poisGraph: any[] = [];

  showSearchResultPOI: any[] = [];
  chipList = new Set();
  wordList: any[] = ['covishield', 'covishield', 'vaccine'];
  sentimentpoiList: any[] = [];
  sentimentList: any[] = [];

  constructor(private httpService: HttpService, private activedRoute: ActivatedRoute, private loaderService: LoaderService, private graphConverter: GraphDataConverterService) {
  }

  ngOnInit(): void {
    this.loaderService.loaderListener().subscribe((res: any) => {
      this.state = res.state
    })
    this.activedRoute.queryParams
      .subscribe(params => {
        this.query = params['query']
        let news = this.httpService.postMethod(environment.news, { query: this.query })
        let search = this.httpService.postMethod(environment.search, { query: this.query })
        forkJoin([news, search]).subscribe((res) => {
          this.newList = res[0]['response']
          this.newList = this.manipulateDisplaySentiment(res[0]['response'])
          this.searchResultNonPOI = []
          this.searchResultPOI = []
          let data = this.manipulateDisplaySentiment(res[1]['response']['docs'])
          data.forEach((element) => {
            if ('poi_name' in element) {
              this.chipList.add(element['poi_name'])
              element["sentimentgraph"] = [{
                "name": element['poi_name'],
                "series": [
                  {
                    "name": "Positive",
                    "value": element['sentiments']["pos"] * 100
                  },
                  {
                    "name": "Neutral",
                    "value": element['sentiments']["neu"] * 100
                  },
                  {
                    "name": "Negative",
                    "value": element['sentiments']["neg"] * 100
                  }
                ]
              }]
              this.searchResultPOI.push(element)
              this.showSearchResultPOI = this.searchResultPOI
            }
            else {
              element["sentimentgraph"] = [{
                "name": "User",
                "series": [
                  {
                    "name": "Positive",
                    "value": element['sentiments']["pos"] * 100
                  },
                  {
                    "name": "Neutral",
                    "value": element['sentiments']["neu"] * 100
                  },
                  {
                    "name": "Negative",
                    "value": element['sentiments']["neg"] * 100
                  }
                ]
              }]
              this.searchResultNonPOI.push(element)
            }
          })
          this.poisGraph = this.graphConverter.convertToBarGraph("sentimentstring", this.searchResultPOI, false, "poi_name")
        })
      }
      );
  }

  manipulateDisplaySentiment(data: any[]) {
    data.forEach((element) => {
      delete element['sentiments']['compound']
      let data = _(element['sentiments'])
        .toPairs()
        .orderBy([1], ['desc'])
        .fromPairs()
        .value()
      let key = Object.keys(data)[0]
      let displaySentiment = null
      if (key == 'neu') {
        displaySentiment = 'Neutral'
      } else if (key == 'neg') {
        displaySentiment = 'Negative'
      } if (key == 'pos') {
        displaySentiment = 'Postive'
      }
      element['sentimentstring'] = displaySentiment
      element["sentimentvalue"] = data[key]
    })
    return data
  }

  changeDisplay(mode: Number): void {
    this.display = mode;
  }

  changeSect(mode: Number): void {
    this.sect = mode;
  }

  filterUser(name: String): void {
    this.showSearchResultPOI = this.searchResultPOI.filter((item) => {
      return item['poi_name'] == name
    })
  }

  changeChip(mode: Number, value: any): void {
    this.selectedChip = mode
    if (mode != 0) {
      this.filterUser(value)
    } else {
      this.showSearchResultPOI = this.searchResultPOI
    }
  }

}

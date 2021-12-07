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
  searchResultPOI: any[] = [];
  searchResultNonPOI: any[] = [];
  state: boolean = false;
  poisGraph: any[] = [];

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
              this.searchResultPOI.push(element)
            }
            else {
              this.searchResultNonPOI.push(element)
            }
          })
          this.poisGraph = this.graphConverter.convertToBarGraph("sentimentstring", this.searchResultPOI, false, "poi_name")
          console.log(this.poisGraph)
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

}

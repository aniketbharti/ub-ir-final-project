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
  wordList: any[] = ['Broad', 'spectrum', 'coronavirus', 'super', 'vaccine', ':', 'Vaccines', 'pneumonia', 'protect', 'new', 'coronavirus', 'batch', 'Russia’s', 'Sputnik', 'V', 'coronavirus', 'vaccine', 'arrives', 'Guatemala', 'batch', 'Russia’s', 'Sputnik', 'V', 'coronavirus', 'vaccine', 'arrives', 'Guatemala', 'news:', 'Coronavirus', 'Briefing:', 'Happened', 'Today', 'New', 'York', 'Times', 'Delta', '‘by', 'far’', 'world’s', 'dominant', 'coronavirus', 'variant', 'says', 'Delta', '‘by', 'far’', 'world’s', 'dominant', 'coronavirus', 'variant', 'says', 'Delta', '‘by', 'far’', 'world’s', 'dominant', 'coronavirus', 'variant', 'says', 'Coronavirus', 'latest:', 'Remdesivir', 'drug', 'lowers', 'Covid', 'hospitalisation', 'risk', 'says', 'Gilead', ':', 'Spraying', 'alcohol', 'chlorine', 'body', 'kill', 'new', 'coronavirus', 'Russia’s', 'Sputnik', 'V', 'vaccine', 'effective', 'Indian', 'coronavirus', 'strain', 'says', 'expert', 'news:', 'Michigan', 'surpasses', '1', 'million', 'confirmed', 'coronavirus', 'cases', 'Wednesday', 'Sept', '22', 'news:', 'New', 'Florida', 'surgeon', 'general', 'DeSantis', 'revise', 'school', 'rule', 'coronavirus', 'quarantines', 'Hello', ':', 'date', 'specific', 'medicine', 'recommended', 'prevent', 'treat', 'new', 'coronavirus', '(2019nCoV)', 'Delta', '‘by', 'far’', 'world’s', 'dominant', 'coronavirus', 'variant', 'says', 'Katerina', 'Ang', 'Today', 'Nurses', 'playing', 'important', 'role', 'fight', 'coronavirus', 'sal…', 'Best', 'Vaccine', 'Prevent', 'Spread', 'Coronavirus', '(COVID19)', 'Disease', 'Read', 'RT', 'Acute', 'disseminated', 'encephalomyelitislike', 'presentation', 'inactivated', 'coronavirus', 'vaccine', '(Sino…', 'coronavirus', 'crisis', 'continues', 'President', 'Trump', 'refusing', 'open', 'nationwide', 'special', 'enrollment', 'per…', 'Coronavirus:', 'India', 'reports', '26964', 'new', 'COVID19', 'cases', 'daily', 'deaths', 'rise', '383', 'news:', 'Minimal', 'number', 'new', 'Sonoma', 'County', 'coronavirus', 'cases', 'tied', 'BottleRock', 'Napa', 'Valley', 'news:', 'Longer', 'mass', 'transit', 'commutes', 'NYC', 'linked', 'higher', 'coronavirus', 'rates', 'study', 'says', 'FDA', 'authorizes', 'coronavirus', 'vaccine', 'older', 'adults', 'high', 'risk', 'COVID19', 'Goa', 'going', 'strong', 'fight', 'Coronavirus', '💪', 'State', 'administered', 'vaccine', 'dose', 'to…', ':', 'evidence', 'current', 'outbreak', 'eating', 'garlic', 'protected', 'people', 'new', 'coronavirus', 'Delta', 'variant', 'widespread', 'variant', 'coronavirus', 'literally', 'observed', 'instance', 'evolution', '\u2066', 'new', 'puppet', 'New', 'Florida', 'surgeon', 'general', 'DeSantis', 'revise', 'school', 'rule', 'coronavirus', 'quarantines', 'WATCH', 'LIVE:', 'New', 'Florida', 'surgeon', 'general', 'DeSantis', 'revise', 'school', 'rule', 'coronavirus', 'quarantines', 'China', 'coronavirus', 'detected', 'fully', 'vaccinates', '1', 'billion', 'people', 'read', 'animal', 'trials', 'mRNA', 'vaccine', 'coronavirus', '1', 'found', 'exactly', 'happenedevery', 'single', 'animal', 'trial', 'died', 'released', 'wild', 'different', 'coronavirus', 'news:', 'Coronavirus:', 'Orange', 'County', 'reported', '259', 'new', 'cases', 'deaths', 'Sept', '22', 'FDA', 'authorizes', 'PfizerBioNTech', 'coronavirus', 'vaccine', 'booster', 'older', 'Americans', 'high', 'risk', 'illness', 'FDA', 'authorizes', 'PfizerBioNTech', 'coronavirus', 'vaccine', 'booster', 'older', 'Americans', 'high', 'risk', 'illness', 'FDA', 'authorizes', 'PfizerBioNTech', 'coronavirus', 'vaccine', 'booster', 'older', 'Americans', 'high', 'risk', 'illness'];
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
          let newList = this.manipulateDisplaySentiment(res[0]['response']['articles'])
          newList.forEach((element) => {
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
          })
          this.newList = newList
          console.log(this.newList)
          this.searchResultNonPOI = []
          this.searchResultPOI = []
          this.state = false
          let data = this.manipulateDisplaySentiment(res[1]['response']['docs'])
          console.log(data)
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

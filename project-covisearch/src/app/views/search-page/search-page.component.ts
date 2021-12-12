import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { GraphDataConverterService } from 'src/app/services/graph.data.converter.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ReplyModalComponent } from 'src/app/components/reply-modal/reply-modal.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  currentItemsToShow: any[] = [];
  currentItemsToShowPOI: any[] = [];

  @ViewChild('paginator1', { static: false }) paginator1:
    | MatPaginator
    | undefined;

  @ViewChild('paginator1', { static: false }) paginator2:
    | MatPaginator
    | undefined;

  tasks: any[] = [
    [
      'Country',
      {
        name: 'All',
        completed: false,
        field: 'country',
        subtasks: [
          { name: 'India', completed: false, value: 'India' },
          { name: 'USA', completed: false, value: 'USA' },
          { name: 'Mexico', completed: false, value: 'Mexico' },
        ],
      },
    ],
    [
      'POIs',
      {
        name: 'All',
        completed: false,
        field: 'poi_name',
        subtasks: [],
      },
    ],
    [
      'Language',
      {
        name: 'All',
        completed: false,
        field: 'tweet_lang',
        subtasks: [
          { name: 'English', completed: false, value: 'en' },
          { name: 'Hindi', completed: false, value: 'hi' },
          { name: 'Spanish', completed: false, value: 'es' },
        ],
      },
    ],
    [
      'Sentiments',
      {
        name: 'All',
        completed: false,
        field: 'sentimentstring',
        subtasks: [
          { name: 'Positive', completed: false, value: 'Positive' },
          { name: 'Negative', completed: false, value: 'Negative' },
          { name: 'Neutral', completed: false, value: 'Neutral' },
        ],
      },
    ],
    [
      'Verification',
      {
        name: 'All',
        completed: false,
        field: 'verified',
        subtasks: [
          { name: 'Vertified', completed: false, value: true },
          { name: 'Unverified', completed: false, value: false },
        ],
      },
    ],
  ];

  allComplete = new Array(this.tasks.length);
  query: any;
  newList: any[] = [];
  searchResultPOI: any[] = [];
  searchResultNonPOI: any[] = [];
  searchTempResultPOI: any[] = [];
  searchTempResultNonPOI: any[] = [];
  state: boolean = false;
  poisGraph: any[] = [];
  chipList = new Set();
  wikiData: any | null;
  emojiIcon: any = {
    Happy:
      'https://www.clipartmax.com/png/middle/283-2834862_happy-smile-emoji-emoticon-icon-smiley.png',
    Neutral:
      'https://www.clipartmax.com/png/middle/263-2637285_neutral-emoji-png-transparent-background-rh-clipart-community-college-of-the-air.png',
    Negative:
      'http://cdn.shopify.com/s/files/1/1061/1924/products/Sad_Face_Emoji_grande.png?v=1571606037',
  };
  constructor(
    private httpService: HttpService,
    private activedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private graphConverter: GraphDataConverterService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loaderService.loaderListener().subscribe((res: any) => {
      this.state = res.state;
    });
    this.activedRoute.queryParams.subscribe((params) => {
      this.query = params['query'];
      this.wikiData = null;
      let news = this.httpService.postMethod(environment.news, {
        query: this.query,
      });
      let search = this.httpService.postMethod(environment.search, {
        query: this.query,
      });
      const queryTerm = this.query.split(' ').join('_');
      this.httpService
        .getMethod(environment.wiki + queryTerm, {})
        .subscribe((res) => {
          if ('extract' in res && 'title' in res) {
            this.wikiData = {};
            this.wikiData['title'] = res['title'];
            this.wikiData['extract'] = res['extract'];
            if ('thumbnail' in res) {
              this.wikiData['img'] = res['thumbnail']['source'];
            }
            if ('content_urls' in res) {
              this.wikiData['url'] = res['content_urls']['desktop']['page'];
            }
          }
          console.log(this.wikiData);
        });
      this.loaderService.changeLoaderState({ state: true, location: 'local' });
      forkJoin([news, search]).subscribe((res) => {
        let newList = res[0]['response']
          ? this.manipulateDisplaySentiment(res[0]['response'])
          : [];
        newList.forEach((element) => {
          element['sentimentgraph'] = [
            {
              name: 'User',
              series: [
                {
                  name: 'Positive',
                  value: element['sentiments']['pos'] * 100,
                },
                {
                  name: 'Neutral',
                  value: element['sentiments']['neu'] * 100,
                },
                {
                  name: 'Negative',
                  value: element['sentiments']['neg'] * 100,
                },
              ],
            },
          ];
        });
        this.newList = newList;
        this.searchResultNonPOI = [];
        this.searchResultPOI = [];
        let data = res[1]['response']['docs']
          ? this.manipulateDisplaySentiment(res[1]['response']['docs'])
          : [];
        data.forEach((element) => {
          if ('poi_name' in element) {
            this.chipList.add(element['poi_name']);
            element['sentimentgraph'] = [
              {
                name: element['poi_name'],
                series: [
                  {
                    name: 'Positive',
                    value: element['sentiments']['pos'] * 100,
                  },
                  {
                    name: 'Neutral',
                    value: element['sentiments']['neu'] * 100,
                  },
                  {
                    name: 'Negative',
                    value: element['sentiments']['neg'] * 100,
                  },
                ],
              },
            ];
            this.searchResultPOI.push(element);
          } else {
            element['sentimentgraph'] = [
              {
                name: 'User',
                series: [
                  {
                    name: 'Positive',
                    value: element['sentiments']['pos'] * 100,
                  },
                  {
                    name: 'Neutral',
                    value: element['sentiments']['neu'] * 100,
                  },
                  {
                    name: 'Negative',
                    value: element['sentiments']['neg'] * 100,
                  },
                ],
              },
            ];
            this.searchResultNonPOI.push(element);
          }
        });
        this.searchResultPOI = _.orderBy(
          this.searchResultPOI,
          ['noofreplies', 'retweet_count', 'favorite_count'],
          ['desc', 'desc', 'desc']
        );
        this.searchTempResultNonPOI = _.orderBy(
          this.searchTempResultNonPOI,
          ['noofreplies', 'retweet_count', 'favorite_count'],
          ['desc', 'desc', 'desc']
        );
        this.searchTempResultPOI = this.searchResultPOI;
        this.searchTempResultNonPOI = this.searchResultNonPOI;
        const a = _.groupBy(this.searchTempResultPOI, 'poi_name');
        Object.keys(a).forEach((element: any) => {
          this.tasks[1][1].subtasks.push({
            name: element,
            completed: false,
            value: element,
          });
        });
        this.poisGraph = this.graphConverter.multiLevelDataMapping(
          'sentimentstring',
          this.searchTempResultPOI,
          false,
          'poi_name'
        );
        this.loaderService.changeLoaderState({
          state: false,
          location: 'local',
        });
        setTimeout(() => {
          this.resetPagination();
        }, 300);
      });
    });
  }

  updateAllComplete(i: number) {
    this.allComplete[i] =
      this.tasks[i][1].subtasks != null &&
      this.tasks[i][1].subtasks.every((t: any) => t.completed);
    this.changeFilter();
  }

  someComplete(i: number): boolean {
    if (this.tasks[i][1].subtasks == null) {
      return false;
    }
    return (
      this.tasks[i][1].subtasks.filter((t: any) => t.completed).length > 0 &&
      !this.allComplete[i]
    );
  }

  setAll(i: number, completed: boolean) {
    this.allComplete[i] = completed;
    if (this.tasks[i][1].subtasks == null) {
      return;
    }
    this.tasks[i][1].subtasks.forEach((t: any) => (t.completed = completed));
    this.changeFilter();
  }

  filterArrayAssign(array: any[], fieldlist: any[]) {
    return array.filter((ele) => {
      let data = fieldlist.map((data) => {
        if (data[1].includes(ele[data[0]])) {
          return true;
        }
        return false;
      });
      return !data.includes(false);
    });
  }

  manipulateDisplaySentiment(data: any[]) {
    data.forEach((element) => {
      delete element['sentiments']['compound'];
      let data = _(element['sentiments'])
        .toPairs()
        .orderBy([1], ['desc'])
        .fromPairs()
        .value();
      let key = Object.keys(data)[0];
      let displaySentiment = null;
      if (key == 'neu') {
        displaySentiment = 'Neutral';
      } else if (key == 'neg') {
        displaySentiment = 'Negative';
      }
      if (key == 'pos') {
        displaySentiment = 'Postive';
      }
      element['sentimentstring'] = displaySentiment;
      element['sentimentvalue'] = data[key];
    });
    return data;
  }

  resetPagination() {
    if (this.paginator1) {
      this.paginator1.pageIndex = 0;
      this.onPageChange({
        pageIndex: this.paginator1.pageIndex,
        pageSize: this.paginator1.pageSize,
      });
    }
    if (this.paginator2) {
      this.paginator2.pageIndex = 0;
      this.onPageChange({
        pageIndex: this.paginator2.pageIndex,
        pageSize: this.paginator2.pageSize,
      });
    }
  }

  changeFilter() {
    let filterField: any[] = [];
    this.tasks.forEach((element) => {
      let tempArray: any[] = [];
      element[1].subtasks.forEach((ele: any) => {
        if (ele.completed) {
          tempArray.push(ele.value);
        }
      });
      if (tempArray.length > 0) {
        filterField.push([element[1].field, tempArray]);
      }
    });
    this.searchResultNonPOI = this.filterArrayAssign(
      this.searchTempResultNonPOI,
      filterField
    );
    this.searchResultPOI = this.filterArrayAssign(
      this.searchTempResultPOI,
      filterField
    );
    this.resetPagination();
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(ReplyModalComponent, {
      width: '750px',
      data: data,
      panelClass: 'my-dialog'
    });
  }

  onPageChange($event: any) {
    this.currentItemsToShow = this.searchResultNonPOI.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
    this.currentItemsToShowPOI = this.searchResultPOI.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
  }
}

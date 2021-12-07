import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GraphDataConverterService } from 'src/app/services/graph.data.converter.service';
import { HttpService } from 'src/app/services/http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-display-summary',
  templateUrl: './display-summary.component.html',
  styleUrls: ['./display-summary.component.scss']
})
export class DisplaySummaryComponent implements OnInit {
  res: any | null = null;
  chartResult: any[] = [];
  barResult: any[] = []
  state: boolean = true;
  constructor(private httpService: HttpService, private graphdata: GraphDataConverterService, private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.loaderListener().subscribe((res: any) => {
      this.state = res.state
    })
    let country = this.httpService.postMethod(environment.countrytweet, {})
    let pois = this.httpService.postMethod(environment.pois, {})
    forkJoin([country, pois]).subscribe((res) => {
      this.chartResult = this.graphdata.convertToChart("country", res[0]['response'])
      this.barResult = this.graphdata.convertToChart("poi_name", res[1]['response'])
      this.loaderService.changeLoaderState({ state: false, location: 'local' })
    })
  }

}

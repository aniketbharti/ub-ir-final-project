import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewSearchPageComponent } from './views/new-search-page/new-search-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationHeaderComponent } from './components/navigation-header/navigation-header.component';
import { AppMaterialModule } from './app.material.module';
import { StatsPageComponent } from './views/stats-page/stats-page.component';
import { HttpService } from './services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { FlagRenderer } from './components/flag-renderer';
import { DisplaySummaryComponent } from './views/display-summary/display-summary.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PiechartComponent } from './components/piechart/piechart.component';
import { BargraphComponent } from './components/bargraph/bargraph.component';
import { GraphDataConverterService } from './services/graph.data.converter.service';
import { SearchPageComponent } from './views/search-page/search-page.component';
import { LoaderService } from './services/loader.service';
import { LoaderComponent } from './components/loader/loader.component';
import { VerticalStackGraphComponent } from './components/vertical-stack-graph/vertical-stack-graph.component';
import { SentimentviewerComponent } from './components/sentimentviewer/sentimentviewer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    NewSearchPageComponent,
    NavigationHeaderComponent,
    SearchPageComponent,
    StatsPageComponent,
    FlagRenderer,
    DisplaySummaryComponent,
    PiechartComponent,
    BargraphComponent,
    LoaderComponent,
    VerticalStackGraphComponent,
    SentimentviewerComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgGridModule.withComponents([FlagRenderer]),
    NgxChartsModule
  ],
  providers: [HttpService, GraphDataConverterService, LoaderService],
  bootstrap: [AppComponent]
})

export class AppModule { }

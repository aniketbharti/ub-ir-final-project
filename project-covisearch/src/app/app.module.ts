import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { SearchPageComponent} from './views/search-page/search-page.component';
import {
  CommonModule
} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NewSearchPageComponent,
    NavigationHeaderComponent,
    SearchPageComponent,
    StatsPageComponent,
    FlagRenderer
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    AgGridModule.withComponents([FlagRenderer])
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})

export class AppModule { }

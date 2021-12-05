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

@NgModule({
  declarations: [
    AppComponent,
    NewSearchPageComponent,
    NavigationHeaderComponent,
    StatsPageComponent,
    FlagRenderer
  ],
  imports: [
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

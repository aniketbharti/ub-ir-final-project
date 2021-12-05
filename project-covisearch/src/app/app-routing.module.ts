import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewSearchPageComponent } from './views/new-search-page/new-search-page.component';
import { StatsPageComponent } from './views/stats-page/stats-page.component';

const routes: Routes = [{
  path: '', component: NewSearchPageComponent
}, {
  path: 'stats', component: StatsPageComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

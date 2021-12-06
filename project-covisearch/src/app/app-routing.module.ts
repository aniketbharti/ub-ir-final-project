import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewSearchPageComponent } from './views/new-search-page/new-search-page.component';
import { StatsPageComponent } from './views/stats-page/stats-page.component';
import { SearchPageComponent } from './views/search-page/search-page.component';
const routes: Routes = [{
  path: '', component: SearchPageComponent
}, {
  path: 'stats', component: StatsPageComponent
},
{ path: 'search', component: SearchPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

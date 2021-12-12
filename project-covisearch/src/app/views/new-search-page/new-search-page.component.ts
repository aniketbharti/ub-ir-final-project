import { OnInit, Component } from "@angular/core";
import { HttpService } from "src/app/services/http.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-new-search-page',
  templateUrl: './new-search-page.component.html',
  styleUrls: ['./new-search-page.component.scss']
})

export class NewSearchPageComponent implements OnInit {
  private news:any;
  newList:any[]=[];
  constructor(  private httpService: HttpService,
    ) { }

  ngOnInit(): void {
  this.httpService.postMethod(environment.news, {
      query: 'coronavirus',
    }).subscribe(data => {
      
      this.news = data;
      console.log(this.news.response);
      this.newList =this.news.response;
   
    });

  }
}

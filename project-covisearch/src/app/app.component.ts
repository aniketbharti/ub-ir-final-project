import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './services/http.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'project-covisearch';
  constructor(private httpService: HttpService) {}
}

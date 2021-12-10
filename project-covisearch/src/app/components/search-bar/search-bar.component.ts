import { isPlatformServer } from '@angular/common';
import { Component, Inject, Injector, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Router } from '@angular/router';

const configKey = makeStateKey('CONFIG');
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @Input('showButton') showButton: boolean = false

  searchForm: any;
  isSubmitted = false;

  constructor(private router: Router, private injector: Injector,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformid: Object,
    private formBuilder: FormBuilder
  ) {
    if (isPlatformServer(this.platformid)) {
      const envJson = this.injector.get('CONFIG') ? this.injector.get('CONFIG') : {};
      this.state.set(configKey, envJson as any);
    }
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: ['', Validators.required],
    });
  }

  get formControls() { return this.searchForm.controls; }


  onClick(): void {
    this.isSubmitted = true
    if (this.searchForm.valid) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchForm?.get('searchTerm')?.value } });
    }
  }

  voiceSearch(): void {
    this.isSubmitted = true
    if ('webkitSpeechRecognition' in window) {
      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = false;
      vSearch.interimresults = false;
      vSearch.lang = 'en-US';
      vSearch.start();
      vSearch.onresult = (e: any) => {
        vSearch.stop();
        this.searchForm.get('searchTerm').patchValue(e.results[0][0].transcript)
      }
      vSearch.onerror = (e: any) => {
        console.log(e);
        vSearch.stop();
      }
    } else {
      console.log(this.state.get(configKey, undefined as any));
    }
  }

}

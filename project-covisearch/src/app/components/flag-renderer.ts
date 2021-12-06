import { Component } from '@angular/core';
import { ICellRendererParams } from '@ag-grid-community/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-gender-renderer',
  template: ` <span> <img [src]="imageSource" height="15px" width="20px"/> {{ value }} </span> `,
})
export class FlagRenderer implements ICellRendererAngularComp {
  imageSource: string = '';
  value: any;
  constructor() { }

  refresh(params: ICellRendererParams): boolean {
    return true
  }

  agInit(params: ICellRendererParams): void {
    this.imageSource = params.data.countryInfo.flag;
    this.value = params.value;
  }
}
import { Injectable } from '@angular/core';
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class GraphDataConverterService {


  constructor() { }

  convertToChart(group_field: string, data: any) {
    const grouped = _.mapValues(_.groupBy(data, group_field),
      clist => clist.map(d => _.omit(d, group_field)));
    const result: any[] = []
    Object.keys(grouped).forEach((key) => {
      const data = {
        name: key,
        value: grouped[key].length
      }
      result.push(data)
    })
    return result
  }

  convertToBarGraph(group_field: string, data: any, single: boolean) {
    if (single) {
      const grouped = _.mapValues(_.groupBy(data, group_field),
        clist => clist.map(d => _.omit(d, group_field)));
      const result: any[] = []
      Object.keys(grouped).forEach((key) => {
        const data = {
          name: key,
          value: grouped[key].length
        }
        result.push(data)
      })
      return result
    }
    return []
  }
}



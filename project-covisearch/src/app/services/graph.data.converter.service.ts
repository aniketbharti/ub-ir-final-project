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

  convertToBarGraph(group_field: string, data: any, single: boolean, field_second?: any) {
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
    } else {
      data = _.groupBy(data, field_second);
      _.forEach(data, (value, key) => {
        data[key] = _.groupBy(data[key], (item) => {
          return item[group_field];
        });
      });
      const result: any[] = []
      Object.keys(data).forEach((key: any) => {
        const list_data: any[] = []
        Object.keys(data[key]).forEach((d: any) => {
          const k = {
            name: d,
            value: data[key][d].length
          }
          list_data.push(k)
        })
        result.push({ name: key, series: list_data })
      })
      return result
    }
  }

}



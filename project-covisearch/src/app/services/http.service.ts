import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getMethod(url: string, body?: Object): Observable<any> {
    if (body) {
      url = url + '?' + new HttpParams(body).toString()
    }
    return this.http.get(url)
  }

  postMethod(url: string, body: Object): Observable<any> {
    return this.http.post(url, body)
  }

  putMethod(url: string, body: Object): Observable<any> {
    return this.http.put(url, body)
  }

  patchMethod(url: string, body: Object): Observable<any> {
    return this.http.patch(url, body)
  }

  deleteMethod(url: string, body: Object): Observable<any> {
    return this.http.delete(url, body)
  }
}

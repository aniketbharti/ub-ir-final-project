import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  getMethod(url: string, body?: Object): Observable<any> {
    if (body) {
      url = url + '?' + new HttpParams(body).toString()
    }
    return this.http.get(url)
  }

  postMethod(url: string, body: Object): Observable<any> {
    return this.http.post(url, JSON.stringify(body), this.httpOptions)
  }

  putMethod(url: string, body: Object): Observable<any> {
    return this.http.put(url, JSON.stringify(body), this.httpOptions)
  }

  patchMethod(url: string, body: Object): Observable<any> {
    return this.http.patch(url, JSON.stringify(body), this.httpOptions)
  }

  deleteMethod(url: string): Observable<any> {
    return this.http.delete(url, this.httpOptions)
  }
}

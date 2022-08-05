import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl = "https://rsvp-ui-exam.herokuapp.com/api";
  constructor(private http: HttpClient) {}
  getRsvpList(): Observable < any[] > {
      return this.http.get < any > (this.APIUrl + '/rsvp');
  }
  addRsvp(val: any) {
      return this.http.post(this.APIUrl + '/rsvp', val);
  }
 
}
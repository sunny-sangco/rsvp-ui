import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitService {

  //we have to set an empty defaultValue for the TableRow
    public defaultValue : string = '';
    public TableRow : BehaviorSubject<string>= new BehaviorSubject<string>(this.defaultValue);
  

    public sendValue(RowtoEmit:string){
      this.TableRow.next(RowtoEmit);}
  
    public getValue():Observable<string>{
        return this.TableRow.asObservable();}  
  
    private customSubject = new Subject<any>();
    customObservable = this.customSubject.asObservable();
  
    // Service message commands
    callComponentMethod(value:any) {
      this.customSubject.next(value);
    }

    constructor() { }
  }
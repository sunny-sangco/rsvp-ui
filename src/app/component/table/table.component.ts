import { Component, OnInit } from '@angular/core';
import { EmitService } from 'src/app/emit.service'
import {Router } from '@angular/router'
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  rsvpList:any = [];

  constructor(private emitService: EmitService, private router: Router , private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getRsvpList();

    //this will trigger once form submitted
    this.emitService.customObservable.subscribe((res) => {
      if(res){
        this.getRsvpList();
      }
    });
  }

  view(value : any)
  {
    this.emitService.sendValue(value);
    this.router.navigateByUrl('/');
  }

  getRsvpList(){
    debugger
    this.sharedService.getRsvpList().subscribe(data=>{
      
    this.rsvpList = data})
  }

}

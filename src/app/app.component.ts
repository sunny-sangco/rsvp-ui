import { Component , Input} from '@angular/core';
import { SharedService } from "src/app/shared.service";
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NotificationService } from './notification.service'
   
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'UI12';

  constructor() {
     }
     

    ngOnInit(): void {
      }


}

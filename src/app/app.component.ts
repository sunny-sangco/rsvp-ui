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
  rsvpList:any = [];
  isView:boolean = false;
  loading = false;
  isAddMode: any;
  form: FormGroup;
  submitted = false;
  isViewMode: any;
  checklist = [
    { id: 1, value: "Yes", isSelected: false },
    { id: 2, value: "No", isSelected: false }
  ];

  constructor(
    private sharedService: SharedService,   
    private formBuilder: FormBuilder,
    private notifyService : NotificationService
    ) {
      this.form = new FormGroup({
        Id: new FormControl(null),
        Name: new FormControl(null),
        Email: new FormControl(null),
        ContactNumber: new FormControl(null),
        Attending:new FormControl(false) 
      });

      this.form = this.formBuilder.group(
        {
          Id: new FormControl(null),
          Name: ['', Validators.required],
          Email: ['', [Validators.required, Validators.email,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
          ContactNumber: ['', [ Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.minLength(10), Validators.maxLength(12)]],
          Attending:['', Validators.required]
        }
      );
     }
     

    ngOnInit(): void {
      this.getRsvpList();
      this.isAddMode = true;
    }

    responseSelected(item: any) {
      this.form.value.Attending = item?.Attending == "Yes" ? true : false
      this.checklist.forEach(val => {
        if (val.id == item.id) val.isSelected = !val.isSelected;
        else {
          val.isSelected = false;
        }
      });
    }

    keyPress(event: any) {
      const pattern = /[0-9\+\-\ ]/;
   
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }

    viewRsvp(item: any){
      this.form.addControl('Id', new FormControl());
    
      this.form.setValue(item);

      var checkBox = document.querySelectorAll('[id="attending"]');

      if(item.Attending){
        (checkBox[0] as HTMLInputElement).checked = true; (checkBox[1] as HTMLInputElement).checked = false;
      }
      else{
        (checkBox[0] as HTMLInputElement).checked = false; (checkBox[1] as HTMLInputElement).checked = true;
      }
      this.form.disable();
      this.isAddMode = false;
    }

    getRsvpList(){
      this.sharedService.getRsvpList().subscribe(data=>{
        this.rsvpList = data})
    }

    onCancel(){
      this.form.reset();
      this.form.enable();
      this.isAddMode = true;
    }

    get f(): { [key: string]: AbstractControl; }
    {
        return this.form.controls;
    }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.createRsvp();
    }

    private createRsvp() {
      this.form.removeControl('Id')
      var checkBox = document.querySelectorAll('[id="attending"]');
      this.form.value.attending = (checkBox[0] as HTMLInputElement).checked == true ? true : false;
      debugger
      this.sharedService.addRsvp(this.form.value)
          .pipe(first())
          .subscribe({
              next: () => {
                //show success alert message
                this.notifyService.showSuccess("Your response successfully saved !!",'Success')
                this.loading = false;
                this.form.reset();
                this.getRsvpList();
              },
              error: error => {
                    //show error alert message
                    this.notifyService.showError("Problem Occurred While Saving !!",'Error')
                  this.loading = false;
              }
          });
    }

}

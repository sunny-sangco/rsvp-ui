import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {Router } from '@angular/router'
import { EmitService } from 'src/app/emit.service'
import { SharedService } from "src/app/shared.service";
import { first } from 'rxjs/operators';
import { NotificationService } from 'src/app/notification.service'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  rsvpList:any = [];
  isView:boolean = false;
  loading = false;
  isAddMode = true;
  form: FormGroup;
  submitted = false;
  isViewMode = false;
  checklist = [
    { id: 1, value: "Yes", isSelected: false },
    { id: 2, value: "No", isSelected: false }
  ];

  ngOnInit(): void {
  }
  TierForm:any = this.formBuilder.group({
    Name:[null,[Validators.required]],
    Email:[null,[Validators.required]],
    ContactNumber:[null,[Validators.required]],
    Attending:[null,[Validators.required]],
  });


constructor( private formBuilder: FormBuilder,  
  private sharedService: SharedService,  
   private router : Router,
   private emitService : EmitService,    
   private notifyService : NotificationService){

    
  this.form = new FormGroup({
        Id: new FormControl(null),
        Name: new FormControl(null),
        Email: new FormControl(null),
        ContactNumber: new FormControl(null),
        Attending:new FormControl(false) 
      });

  this.emitService.getValue().subscribe(
    (d:any)=>{
      debugger
      if(d != null)
      {
        debugger
      this.TierForm.get('Name').setValue(d.Name ?? null);
      this.TierForm.get('Email').setValue(d.Email ?? null);
      this.TierForm.get('ContactNumber').setValue(d.ContactNumber ?? null);
      this.TierForm.get('Attending').setValue(d.Attending ?? null);
      this.isAddMode = false;
      //this will set attending response value
      this.form.addControl('Id', new FormControl());
    
      this.form.setValue(d);

      var checkBox = document.querySelectorAll('[id="attending"]');

      if(d.Attending){
        (checkBox[0] as HTMLInputElement).checked = true; (checkBox[1] as HTMLInputElement).checked = false;
      }
      else{
        (checkBox[0] as HTMLInputElement).checked = false; (checkBox[1] as HTMLInputElement).checked = true;
      }
      //this will set attending response value
      this.form.disable();

    }}); 

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

    this.form.reset();
    this.form.enable();
    this.isAddMode = true;
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

            this.resetForm();

            this.emitService.callComponentMethod(true);
          },
          error: error => {
                //show error alert message
                this.notifyService.showError("Problem Occurred While Saving !!",'Error')
              this.loading = false;
          }
      });

 
}

resetForm(){
  this.form.reset();
  this.form.controls['Name'].setErrors(null);
  this.form.controls['Email'].setErrors(null);
  this.form.controls['ContactNumber'].setErrors(null);
  this.form.controls['Attending'].setErrors(null);
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
}
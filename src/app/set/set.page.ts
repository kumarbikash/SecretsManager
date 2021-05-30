import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SetService } from 'src/app/services/api/set.service';
import { Password } from '../models/password.model';

import { AlertController } from '@ionic/angular';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetService } from '../services/api/get.service';

@Component({
  selector: 'app-set',
  templateUrl: './set.page.html',
  styleUrls: ['./set.page.scss'],
})
export class SetPage implements OnInit {

  id_edit: string = "";
  key_edit: string = "";
  p_edit: Password = new Password();
  type_edit: string = "";

  types: any = [
    {"name": "Password", "value": "pw"}, 
    {"name": "Card", "value": "cd"}
  ];

  passwordAddForm = new FormGroup({
    type: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    remark: new FormControl('')
  });

  constructor(
    private setservice: SetService,
    private getservice: GetService,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.id_edit = this.route.snapshot.paramMap.get('id');
    this.type_edit = this.route.snapshot.paramMap.get('type');

    if (this.id_edit != null && this.id_edit != undefined && this.id_edit != "") {
      this.getservice.getKeys().then(data => {
        this.key_edit = data.keys.find(x => x == this.id_edit); 

        this.getservice.getObject(this.key_edit).then(data => {
          let data_p = JSON.parse(data);
  
          this.p_edit.type = data_p.t;
          this.p_edit.name = data_p.n;
          this.p_edit.uname = data_p.u;
          this.p_edit.password = data_p.p;
          this.p_edit.remark = data_p.r;
          
          this.passwordAddForm = new FormGroup({
            type: new FormControl(this.p_edit.type ? this.p_edit.type : '', Validators.required),
            name: new FormControl(this.p_edit.name ? this.p_edit.name : '', Validators.required),
            username: new FormControl(this.p_edit.uname ? this.p_edit.uname : '', Validators.required),
            password: new FormControl(this.p_edit.password ? this.p_edit.password : '', Validators.required),
            remark: new FormControl(this.p_edit.remark ? this.p_edit.remark : '')
          });
        });
      });
    }
    
  }



  onSubmit() {
    if (this.passwordAddForm.invalid) {
      console.error("Form must be complete in all respect");
      return;
    }

    let data = new Password();
    this.readFormValues(data);

    this.clearFormValues();

    if (this.id_edit == null || this.id_edit == undefined || this.id_edit == "") {
      this.setservice.setObject(data).then(success => {
        this.presentAlert("Success", "", "Entered data has been saved successfully.", true);
        
      }, failure => {
        this.presentAlert("Failure", "", "There was a problem saving the data. Try again later.", false);
      });
    }
    else {
      this.setservice.setObject(data, this.key_edit).then(success => {
        this.presentAlert("Success", "", "Entered data has been saved successfully.", true);
        
      }, failure => {
        this.presentAlert("Failure", "", "There was a problem saving the data. Try again later.", false);
      });
    }


  }

  private clearFormValues() {
    this.passwordAddForm.setValue({
      type: "",
      name: "",
      username: "",
      password: "",
      remark: ""
    });
  }

  private readFormValues(d: Password) {
    d.type = this.passwordAddForm.value.type;
    d.name = this.passwordAddForm.value.name;
    d.uname = this.passwordAddForm.value.username;
    d.password = this.passwordAddForm.value.password;
    d.remark = this.passwordAddForm.value.remark;
  }

  async presentAlert(header: string, subheader: string, msg: string, redirect: boolean) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subheader,
      message: msg,
      buttons: [
        {
          text: 'OK',
          cssClass: "primary",
          handler: (blah) => {
            if (redirect) {
              this.router.navigateByUrl('/get');
            }
          }
        }
      ]
    });

    await alert.present();
  }

}

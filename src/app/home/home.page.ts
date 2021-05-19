import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { AlertController, LoadingController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
const { App } = Plugins;

import { GetService } from 'src/app/services/api/get.service';
import { SetService } from 'src/app/services/api/set.service';
import { Password } from '../models/password.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  action: string = "";
  existingdata: any = null;
  lbldialoguetitle: string = "Create Login!";

  constructor(
    private getservice: GetService,
    private setservice: SetService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private loadingController: LoadingController
  ) {

  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe(params => {
      this.action = params['action'];
    });

    if (this.action == "changepassword") {
      this.lbldialoguetitle = "Enter New Password";
      // pick all existing stored data in decrypted form
      this.getservice.getAllRecords().then(value => {
        this.existingdata = value;
      });
      // change password - when success - encrypt and store the passwords back
      this.presentCreateLoginAlertPrompt();
    }
    else {
      this.lbldialoguetitle = "Create Login!";
      this.checkLoginExistsOrNot().then(d => {
        if (d) {
          // prompt for login
          if (!this.getservice.isUserLoggedIn()) {
            this.presentDoLoginAlertPrompt();
          }
        }
        else {
          // prompt to create login
          this.presentCreateLoginAlertPrompt();
        }
      });
    }
  }

  checkLoginExistsOrNot(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let ret: boolean = false;
      this.getservice.doesLoginExists().then(data => {
        ret = data;
      }).then(a => {
        resolve(ret);
      });
    });
  }

  async presentCreateLoginAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.lbldialoguetitle,
      inputs: [
        {
          name: 'pwd1',
          type: 'password',
          id: 'pwd1',
          placeholder: 'Type Access Password (10-40 char)'
        },
        {
          name: 'pwd2',
          type: 'password',
          id: 'pwd2',
          placeholder: 'Retype Access Password (10-40 char)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            if (this.action != "changepassword") {
              App.exitApp();
            }
          }
        },
        {
          text: 'Ok',
          cssClass: "text-success",
          handler: (form) => {
            if (form.pwd1.length < 10 || form.pwd1.length > 40) {
              this.presentAlert("Warning", "", "Access Passwords must be between 10 and 40 characters !", "text-danger", true);
              return;
            }
            if (form.pwd1 == form.pwd2) {
              this.createLogin(form.pwd1);
            }
            else {
              this.presentAlert("Warning", "", "Access Passwords are not matching !", "text-warning", true);
              return;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async createLogin(password: string) {
    this.presentLoading().then(async () => {
      await this.setservice.setLoginDetails(password).then(async () => {
        await this.reEncryptExisting().then(() => {
          this.dismissLoading();
          this.presentAlert("Success", "", "Action Completed Successfully !", "text-success", false);
        });
      });
    });
  }

  getP(record: any): Password {
    return {
      id: record.i,
      type: record.t,
      name: record.n,
      uname: record.u,
      password: record.p,
      remark: record.r
    }
  }

  async reEncryptExisting() {
    if (this.action == "changepassword") {
      return Promise.all(
        this.existingdata.map(async (element) => {
          return await this.setservice.setObject(this.getP(element), element.i);
        })
      );
    }
  }

  checkLogin(password: string) {
    this.getservice.checkLoginDetails(password).then(data => {
      // all ok, nothing to do
      // continue as usual, with the app
    }, response => {
      // incorrect input, repeat asking
      this.presentAlertLoginCheck("Warning", "", "Incorrect input !", "text-danger", true)
    })
  }

  async presentAlert(header: string, subheader: string, msg: string, cssclass: string, promptagain: boolean) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subheader,
      message: msg,
      buttons: [
        {
          text: 'OK',
          cssClass: cssclass,
          handler: (blah) => {
            if (promptagain) {
              this.presentCreateLoginAlertPrompt();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertLoginCheck(header: string, subheader: string, msg: string, cssclass: string, promptagain: boolean) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subheader,
      message: msg,
      buttons: [
        {
          text: 'OK',
          cssClass: cssclass,
          handler: (blah) => {
            if (promptagain) {
              this.presentDoLoginAlertPrompt();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentDoLoginAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Login!',
      inputs: [
        {
          name: 'pwd',
          type: 'password',
          id: 'pwd',
          placeholder: 'Type Access Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            App.exitApp();
          }
        },
        {
          text: 'Ok',
          cssClass: "text-success",
          handler: (form) => {
            this.checkLogin(form.pwd);
          }
        }
      ]
    });

    await alert.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }

}

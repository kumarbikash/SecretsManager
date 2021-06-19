import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';

import { Password } from '../models/password.model';

import { SetService } from 'src/app/services/api/set.service';

import { GetService } from 'src/app/services/api/get.service';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.page.html',
  styleUrls: ['./restore.page.scss'],
})
export class RestorePage implements OnInit {

  uploadedData: any;
  restorepoints: any = null;

  constructor(
    private setservice: SetService,
    private getservice: GetService,
    private alertController: AlertController
  ) { 
    this.restorepoints = [
      {"Point": "Click the button to choose the backup file. A valid backup file is required."},
      {"Point": "Your current Access Password should be the same, which was used while taking the backup. Later on, you can change the Access Password as desired."},
      {"Point": "All the records in the file would be restored."}
    ];
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      let data: any;
      let fileReader = new FileReader();
      fileReader.onload =  (fileLoadedEvent) => {
        data = JSON.parse(fileLoadedEvent.target.result.toString());
        this.getservice.decString(data).then((res:any) => {
          JSON.parse(res).forEach(element => {
            this.pushToStorage(element);
          });
        });
      };
      fileReader.onloadend = () => {
        this.presentAlert("Success", "", "Restored successfully.");
      };

      fileReader.readAsText(file, "UTF-8");
    }
  }

  pushToStorage(obj) {
    let data = new Password();
    this.readData(data, obj);
    this.setservice.setObject(data, data.id).then(success => {
      // console.log('pushed ', JSON.stringify(obj));
    }, failure => {
      // console.log('failure ', JSON.stringify(obj));
    });
  }

  readData(d: Password, s: any) {
    d.id = s.i;
    d.type = s.t;
    d.name = s.n;
    d.uname = s.u;
    d.password = s.p;
    d.remark = s.r;
  }

  async presentAlert(header: string, subheader: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subheader,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}

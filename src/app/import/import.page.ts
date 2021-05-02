import { Component, OnInit } from '@angular/core';

import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

const { Filesystem } = Plugins;

import { LoadingController, AlertController } from '@ionic/angular';

import { Papa } from 'ngx-papaparse';
import { Password } from '../models/password.model';

import { SetService } from 'src/app/services/api/set.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.page.html',
  styleUrls: ['./import.page.scss'],
})
export class ImportPage implements OnInit {

  constructor(
    private loadingController: LoadingController,
    private papa: Papa,
    private setservice: SetService,
    private alertController: AlertController
  ) { }

  messageToDisplay: string = "";

  ngOnInit() {
  }

  downloadFormat() {
    this.presentLoading().then(() => {
      const csvheader = [
        ["DisplayName", "UserName", "Password", "Remark"]
      ];

      this.fileWrite(this.papa.unparse(csvheader), 'ImportFormat.csv').then(() => {
        this.dismissLoading();
      });
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  async fileWrite(content: any, filename: string) {
    try {
      const result = await Filesystem.writeFile({
        path: '/' + filename,
        data: content,
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      });
      this.messageToDisplay = "File saved to '" + result.uri + "'";
    } catch (e) {
      //console.error('Unable to write file', e);
    }
  }


  onFileSelected(event) {
    this.presentLoading().then(() => {
      const file: File = event.target.files[0];

      if (file) {
        let data: any;
        let fileReader = new FileReader();
        fileReader.onload = (fileLoadedEvent) => {
          data = fileLoadedEvent.target.result.toString();

          this.papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              result.data.forEach(element => {
                this.pushToStorage(element);
              });
              this.dismissLoading();
            }
          });

        };
        fileReader.onloadend = () => {
          this.presentAlert("Success", "", "Imported successfully.");
        };

        fileReader.readAsText(file, "UTF-8");
      }
    });
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

  readData(target: Password, source: any) {
    target.id = null;
    target.type = "pw";
    target.name = source.DisplayName;
    target.uname = source.UserName;
    target.password = source.Password;
    target.remark = source.Remark;
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

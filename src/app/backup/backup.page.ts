import { Component, OnInit } from '@angular/core';

import { LoadingController } from '@ionic/angular';

import { GetService } from 'src/app/services/api/get.service';

import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-backup',
  templateUrl: './backup.page.html',
  styleUrls: ['./backup.page.scss'],
})
export class BackupPage implements OnInit {

  records: any = [];
  fileWriteResult: string = "";
  backuppoints: any = null;

  constructor(
    private getservice: GetService,
    private loadingController: LoadingController,
  ) { 
    this.backuppoints = [
      {"Point": "Backup file will include all the secrets you have saved. It will be saved to Documents directory under your device memory."},
      {"Point": "It will be encrypted using your existing Access Password. Same Access Password should exist, during restore operation."},
      {"Point": "Despite of being encrypted, take appropriate measures to protect your stored sensitive data, while handling this backup file."},
      {"Point": "If for any reason, file is not generated, you may copy the content below (button \"Copy to Clipboard\") and paste in any text file and save it. The copied text will also be encrypted using your existing Access Password and will not be human readable. Follow all safety measures to protect the sensitive data (in clipboard as well as the saved file)."}
    ];
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadData();
  }

  private loadData() {
    this.getservice.getAllRecords().then(async (value) => {
      this.getservice.encString(JSON.stringify(value)).then(result => {
        this.records = result;
      });
    });
  }

  createBackup() {
    this.presentLoading().then(() => {
      let Now = new Date();
      let res = Now.toISOString().replace(/-/g, "").replace(/:/g, "").replace(/T/g, "").replace(/Z/g, "").replace(/\./g, "");

      this.fileWrite(JSON.stringify(this.records), res + '-backup.smb').then(() => {
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
      this.fileWriteResult = "File saved to '" + result.uri + "'";
    } catch (e) {
      //console.error('Unable to write file', e);
    }
  }

  async copyContent() {
    Plugins.Clipboard.write({
      string: JSON.stringify(this.records)
    });

    await Plugins.Toast.show({
      text: 'Copied!',
      duration: 'short'
    });
  }

}

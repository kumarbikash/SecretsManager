import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { GetService } from 'src/app/services/api/get.service';
import { DelService } from 'src/app/services/api/del.service';
import { Record } from 'src/app/models/record';

import { LoadingController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';

import * as $ from 'jquery';

import { Plugins } from '@capacitor/core';

const { Clipboard } = Plugins;

const { Toast } = Plugins;

@Component({
  selector: 'app-get',
  templateUrl: './get.page.html',
  styleUrls: ['./get.page.scss'],
})
export class GetPage implements OnInit {

  constructor(
    private getservice: GetService,
    private delservice: DelService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController
  ) { }

  records: Record[] = [];
  searchrecords: Record[] = [];
  key_del: string = "";
  type_filter: string = "";
  lbl_pvalue: string = "";
  lbl_svalue: string = "";

  @ViewChild('search', { static: true }) input: ElementRef;

  types: any = [
    { "name": "Password", "value": "pw" },
    { "name": "Card", "value": "cd" }
  ];

  filterForm = new FormGroup({
    type: new FormControl("", Validators.required)
  });

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.input.nativeElement.value = "";

    this.filterForm.setValue({
      type: this.types[0].value
    });
    this.onSubmit();
  }

  private loadData() {
    this.presentLoading().then(() => {
      this.getservice.getAllRecords(this.type_filter).then(value => {
        this.records = <Record[]><unknown> value.filter(Boolean);
        this.searchrecords = <Record[]><unknown> value.filter(Boolean);
        this.sortData();
      }).then(() => {
        this.dismissLoading();
      });
    });
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  private sortData() {
    this.sort_by_key(<string[]><unknown> this.searchrecords, "n");
  }

  private sort_by_key(array: string[], key: string) {
    array.sort((a, b) => {
      return ((a[key].toString() < b[key].toString()) ? -1 : (a[key].toString() > b[key].toString()) ? 1 : 0);
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


  toggle(element) {
    if (element.target.nextSibling.style.display != "none") {
      $(element.srcElement.nextSibling).fadeToggle(500);
    }
    else {
      $(element.srcElement.nextSibling).fadeToggle(500);
    }
  }

  async copyText(text: string) {
    Clipboard.write({
      string: text
    });

    await Toast.show({
      text: 'Copied!',
      duration: 'short'
    });
  }

  editRecord(id) {
    this.router.navigateByUrl("/set/" + this.type_filter + "/" + id);
  }

  deleteRecord(id) {
    this.presentAlertConfirm("Confirm!", "", "Are you sure? It will be permanently deleted!", id);
  }

  async presentAlert(header: string, subheader: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subheader,
      message: msg,
      buttons: [
        {
          text: 'OK',
          cssClass: 'secondary',
          handler: (blah) => {
            this.loadData();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertConfirm(header: string = "Confirm!", subheader: string, msg: string, id: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subheader,
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // nothing to do
          }
        }, {
          text: 'Okay',
          cssClass: 'text-danger',
          handler: () => {
            this.getservice.getKeys().then(data => {
              this.key_del = data.keys.find(x => x == id);
              this.delservice.removeItem(this.key_del).then(data => {
                this.presentAlert("Success", "", "Deleted Successfully.");
              });
            });
          }
        }
      ]
    });

    await alert.present();
  }

  onSubmit() {
    this.type_filter = this.filterForm.value.type;

    this.records = [];
    this.searchrecords = [];

    if (this.type_filter && this.type_filter != null && this.type_filter != "" && this.type_filter != undefined) {
      this.loadData();
    }
    switch (this.type_filter) {
      case 'pw':
        this.lbl_pvalue = "User";
        this.lbl_svalue = "Pass.";
        break;
      case 'cd':
        this.lbl_pvalue = "Card";
        this.lbl_svalue = "CVV/ Exp";
        break;
      default:
        this.lbl_pvalue = "P. Value";
        this.lbl_svalue = "Secret";
        break;
    }
  }

  onSearch(searchString: string) {
    this.searchrecords = this.records.filter((x: any) => {
      return (x.n.toLowerCase().indexOf(searchString.toLowerCase()) != -1 || x.u.toLowerCase().indexOf(searchString.toLowerCase()) != -1 || x.p.toLowerCase().indexOf(searchString.toLowerCase()) != -1 || x.r.toLowerCase().indexOf(searchString.toLowerCase()) != -1)
    });
  }

}

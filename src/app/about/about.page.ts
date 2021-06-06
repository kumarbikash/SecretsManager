import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  appversion: string = "";

  sourcecode: string = "";

  aboutpoints: any = null;

  constructor() { 
    this.aboutpoints = [
      {"Point": "If you either deal with a lot of secrets/ credentials or if you find it difficult to remember all those secrets/ credentials, then this app will help you. "},
      {"Point": "Almost every internal design details we are trying to make public, to make the user's feel confident while using the app."},
      {"Point": "You can store secrets (like password of different websites, servers, services etc. or any payment card details)."},
      {"Point": "It is an offline app and it never exchanges the stored data over Internet. "},
      {"Point": "It relies on the local storage of your device."},
      {"Point": "Sensitive part of the data is stored in an encrypted form."},
      {"Point": "Apart from the Ionic platform and Angular framework, other main libraries/ tools used in this app are:- (1) JQuery (2) Bootstrap (3) crypto-js (4) js-sha512 (5) ngx-papaparse.js."},
      {"Point": "User is solely responsible for any kind of loss or damage, arising directly or indirectly by using this app."},
      {"Point": "For complete detail, also refer the Rules section of the app."}
    ];
  }

  ionViewDidEnter() {
    this.appversion = environment.appVersion;
    this.sourcecode = environment.sourceCodeUrl;
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  logopath: string = "/assets/logo.png";

  t: any;

  constructor() {

  }

  ngOnInit() {
    App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) {
        this.t = setTimeout(() => {
          App.exitApp();
        }, 60000);
      }
      else {
        clearTimeout(this.t);
      }
    });
  }


}

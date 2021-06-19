import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

import { sha512 } from 'js-sha512';

import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
//import { resolve } from 'node:path';


@Injectable({
  providedIn: 'root'
})
export class GetService {

  loggedInStatus: boolean = false;

  encKey: string;

  constructor() {

  }

  async getObject(key: string): Promise<string> {

    return new Promise<string>((resolve, reject) => {
      let tempJson: any;
      Storage.get({ key: key }).then(data => {
        tempJson = JSON.parse(data.value);

        tempJson.p = CryptoJS.AES.decrypt(tempJson.p, this.getEncKey()).toString(CryptoJS.enc.Utf8);
        tempJson.u = CryptoJS.AES.decrypt(tempJson.u, this.getEncKey()).toString(CryptoJS.enc.Utf8);
      }).then(a => {
        resolve(JSON.stringify(tempJson));
      });
    });
  }

  async getKeys() {
    return await Storage.keys();
  }

  async getAllRecords(type?: string): Promise<string[]> {
    return await this.getNonLoginKeys().then(async (value) => {
      return await this.getNonLoginObjects(value, type);
    });
  }

  async getNonLoginKeys(): Promise<string[]> {
    return await new Promise<string[]>((resolve, reject) => {
      this.getKeys().then(value => {
        resolve(value.keys.filter(x => x != 'login'));
      });
    });
  }

  async getNonLoginObjects(keysarray: string[], type: string): Promise<string[]> {
    return Promise.all(
      keysarray.map(async (key) => {
        const object = await this.getObject(key);
        if (type) {
          if (JSON.parse(object).t == type) {
            return JSON.parse(object);
          }
          else {
            return false;
          }
        }
        else {
          return JSON.parse(object);
        }
      })
    );
  }

  async checkLoginDetails(password: string): Promise<boolean> {
    return await new Promise<boolean>(async (resolve, reject) => {
      const { value } = await Storage.get({ key: 'login' });
      if (value == sha512(password + "5ekr|tS@lt")) {
        this.loggedInStatus = true;
        this.encKey = password;
        resolve(true);
      }
      else {
        reject("Incorrect Input");
      }
    });
  }

  async doesLoginExists() {
    const { value } = await Storage.get({ key: 'login' });
    if (value != null && value != "" && value != undefined) {
      return true;
    }
    else {
      return false;
    }
  }

  isUserLoggedIn(): boolean {
    return this.loggedInStatus;
  }

  getEncKey() {
    return this.encKey;
  }

  async encString(str: string): Promise<string> {
    return await CryptoJS.AES.encrypt(str, this.getEncKey()).toString();
  }

  async decString(str: string): Promise<string> {
    return await CryptoJS.AES.decrypt(str, this.getEncKey()).toString(CryptoJS.enc.Utf8);
  }

}

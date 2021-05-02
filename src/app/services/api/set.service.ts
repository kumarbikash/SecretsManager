import { Injectable } from '@angular/core';
import { Password } from 'src/app/models/password.model';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

import { sha512 } from 'js-sha512';

import * as CryptoJS from 'crypto-js';

import { GetService } from 'src/app/services/api/get.service';

@Injectable({
  providedIn: 'root'
})
export class SetService {

  constructor(
    private getservice: GetService
  ) { 

  }

  public async setObject(passwordobj: Password, id?: string) {
    let currentTimeInMilliseconds = Date.now().toString();
    await Storage.set({
      key: id ? id : currentTimeInMilliseconds,
      value: JSON.stringify({
        i: id ? id : currentTimeInMilliseconds,
        t: passwordobj.type,
        n: passwordobj.name,
        u: CryptoJS.AES.encrypt(passwordobj.uname, this.getservice.getEncKey()).toString(),
        p: CryptoJS.AES.encrypt(passwordobj.password, this.getservice.getEncKey()).toString(),
        r: passwordobj.remark
      })
    });
  }

  async setLoginDetails(password: string): Promise<boolean> {
    return await new Promise<boolean>(async (resolve, reject) => {
      await Storage.set({
        key: 'login',
        value: sha512(password + "5ekr|tS@lt")
      }).then(async () => {
        await this.getservice.checkLoginDetails(password).then(val => {
          resolve(val);
        });
      });
    });
  }

}

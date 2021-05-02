import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DelService {

  constructor() { }

  async removeItem(id: string) {
    await Storage.remove({
      key: id
    });
  }

}

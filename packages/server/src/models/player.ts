import * as API from '@nhie/api';
import { Socket } from 'socket.io';
import { v4 } from 'uuid';

export default class Player implements API.IPlayer {
  public id = v4()
  constructor(public socket: Socket, public name: string) {}

  toJSON(): API.IPlayer {
    return {
      id: this.id,
      name: this.name,
    }
  }
}

import * as API from '@nhie/api';
import { v4 } from 'uuid';

export default class Player implements API.IPlayer {
  public id = v4()
  constructor(public name: string) {}
}
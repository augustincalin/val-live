import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorPlatform } from '@capacitor/core/types/platforms';
import * as signalR from '@microsoft/signalr';
import { Coordinates, Valuation } from '@val-live/model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  public dataReceived$: Subject<Valuation> = new Subject<Valuation>();

  private hubConnection: signalR.HubConnection | undefined;
  private serverUrl = 'localhost';

  constructor(){
    if (Capacitor.getPlatform() === 'android') {
      this.serverUrl = '10.0.2.2';
    }
  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`http://${this.serverUrl}:5299/valuationHub`)
      .withAutomaticReconnect()
      .build();

    this.setMethods();

    this.hubConnection
      .start()
      .then(() =>
        console.log(`Connection started: ${this.hubConnection?.connectionId}.`)
      )
      .catch((err) => {
        console.log(`Error while starting connection: ${err}`);
      });
  };

  public getValuation(coordinates: Coordinates) {
    this.hubConnection?.invoke('GetValuation', coordinates);
  }

  private setMethods() {
    this.hubConnection?.on('CalcValuation', (data: Valuation) => {
      this.dataReceived$.next(data);
    });
  }
}

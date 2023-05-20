import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HomeComponent } from './Home/home.component';
import { ModelModule } from '@val-live/model';
import { SignalrService } from './signalr-service/signalr.service';
import { HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import { GeoService } from './geo/geo.service';

registerLocaleData(localeDe, 'de-DE');

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, HomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    ModelModule,
  ],
  providers: [
    SignalrService,
    GeoService,
    {
      provide: APP_INITIALIZER,
      useFactory: (signalrService: SignalrService) => () =>
        signalrService.startConnection(),
      deps: [SignalrService],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'de-DE' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

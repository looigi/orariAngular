import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { HttpClientService } from './services/httpclient.service';
import { VariabiliGlobali } from './VariabiliGlobali.component';
import { HttpClientModule } from '@angular/common/http';
import { ModificaGiorno } from './modificagiorno/modificagiorno.component';
import { FormsModule } from '@angular/forms';
import { CalendarioModule } from 'calendario';
import { Ricerche } from './ricerche/ricerche.component';
import { Statistiche } from './statistiche/statistiche.component';
import { Impostazioni } from './impostazioni/impostazioni.component';
import {PlatformModule} from '@angular/cdk/platform';

@NgModule({
  declarations: [
    AppComponent,
    ModificaGiorno,
    Ricerche,
    Statistiche,
    Impostazioni
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    CalendarioModule,
    FormsModule,
    PlatformModule
  ],
  providers: [
    HttpClientService,
    ApiService,
    VariabiliGlobali,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

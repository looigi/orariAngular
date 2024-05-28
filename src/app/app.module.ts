import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { HttpClientService } from './services/httpclient.service';
import { VariabiliGlobali } from './VariabiliGlobali.component';
import { HttpClientModule } from '@angular/common/http';
import { ModificaGiorno } from './modificagiorno/modificagiorno.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ModificaGiorno
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule
  ],
  providers: [
    HttpClientService,
    ApiService,
    VariabiliGlobali,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

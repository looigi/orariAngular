import { Injectable } from '@angular/core';
import { HttpClientService } from './httpclient.service';
import { Location } from '@angular/common';
import { VariabiliGlobali } from '../VariabiliGlobali.component';

@Injectable()

export class ApiService {
  // private urlBase = this.variabiliGlobali.urlWS;
  // private urlRoot = environment.urlRoot;

  constructor(
    private httpclient: HttpClientService,
    private location: Location,
    private variabiliGlobali: VariabiliGlobali
    ) {
  }

  cambiaChar(ee: string, c1: string, c2: string) {
    while (ee.indexOf(c1) > -1) {
        ee = ee.replace(c1, c2);
    }
    return ee;
  }

  sistemaTesto(e: string | null | undefined): string {
    if (e === undefined || e === 'undefined' || e === '' || e === null) {
        return '';
    }

    let ee = e.toString();

    ee = this.cambiaChar(ee, '<', '%3C');
    ee = this.cambiaChar(ee, '>', '%3E');
    ee = this.cambiaChar(ee, '#', '%23');
    ee = this.cambiaChar(ee, '{', '%7B');
    ee = this.cambiaChar(ee, '}', '%7D');
    ee = this.cambiaChar(ee, '|', '%7C');
    ee = this.cambiaChar(ee, '\\', '%5C');
    ee = this.cambiaChar(ee, '^', '%5E');
    ee = this.cambiaChar(ee, '~', '%7E');
    ee = this.cambiaChar(ee, '[', '%5B');
    ee = this.cambiaChar(ee, ']', '%5D');
    ee = this.cambiaChar(ee, '`', '%60');
    // ee = this.cambiaChar(ee, ';', '%3B');
    ee = this.cambiaChar(ee, '/', '%2F');
    ee = this.cambiaChar(ee, '?', '%3F');
    ee = this.cambiaChar(ee, ':', '%3A');
    ee = this.cambiaChar(ee, '@', '%40');
    ee = this.cambiaChar(ee, '=', '%3D');
    ee = this.cambiaChar(ee, '&', '%26');
    ee = this.cambiaChar(ee, '$', '%24');

    return ee;
  }

  /* chiamataPost(modulo: string, funzione: string, jsonString: any) {
    // console.log(environment.serverPostRest + '/' + funzione, jsonString);
    return this.httpclient.post(this.variabiliGlobali.urlWS + modulo + '/' + funzione, jsonString);
  } */

  SistemaStringaRitornata(stringa) {
    let s = stringa.split('>');
    // console.log(s);
    let s3 = s[2];
    if (s.indexOf('>') - 1) {
      for (let i = s3.length - 2; i > 0; i--) {
        // console.log(s3.substring(i, i + 1));
        if (s3.substring(i, i + 1) === '<') {
          s3 = s3.substring(0, i);
          break;
        }
      }
      // console.log(s3);
    }
    return s3;
  }

  effettuaChiamata(chiamata) {
    const ritorno = this.httpclient.get(chiamata);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaGiornata(giorno, mese, anno) {
    this.variabiliGlobali.CaricamentoInCorso = true;

    const url = this.variabiliGlobali.urlWS + 'Orari.asmx/RitornaOrario?' +
      'idUtente=' + this.variabiliGlobali.idUtente + '&' +
      'Giorno=' + giorno + '&' +
      'Mese=' + mese + '&' +
      'Anno=' + anno;

    return this.effettuaChiamata(url);
  }

  ritornaDatiPerGiornata() {
    this.variabiliGlobali.CaricamentoInCorso = true;

    const url = this.variabiliGlobali.urlWS + 'Orari.asmx/RitornaDatiPerModificaOrario?' +
      'idUtente=' + this.variabiliGlobali.idUtente;

    return this.effettuaChiamata(url);
  }

  ritornaCommesse(idLavoro) {
    this.variabiliGlobali.CaricamentoInCorso = true;

    const url = this.variabiliGlobali.urlWS + 'Orari.asmx/RitornaCommesseLavoro?' +
      'idUtente=' + this.variabiliGlobali.idUtente + '&' +
      'idLavoro=' + idLavoro;

    return this.effettuaChiamata(url);
  }
  
  salvaGiornata(parametri) {
    this.variabiliGlobali.CaricamentoInCorso = true;

    const url = this.variabiliGlobali.urlWS + 'Orari.asmx/ScriveOrario?' +
      'idUtente=' + this.variabiliGlobali.idUtente + '&' +
      'Giorno=' + parametri.giorno + '&' +
      'Mese=' + parametri.mese + '&' + 
      'Anno=' + parametri.anno + '&' +
      'QuanteOre=' + parametri.QuanteOre + '&' +
      'Note=' + parametri.Note + '&' +
      'Misti=' + parametri.Misti + '&' +
      'CodCommessa=' + parametri.CodCommessa + '&' +
      'Entrata=' + parametri.Entrata + '&' +
      'idLavoro=' + parametri.idLavoro + '&' +
      'idIndirizzo=' + parametri.idIndirizzo + '&' +
      'Km=' + parametri.Km + '&' +
      'Pranzo=' + parametri.Pranzo + '&' +
      'Pasticca=' + parametri.Pasticca + '&' +
      'MezziAndata=' + parametri.MezziAndata + '&' +
      'MezziRitorno=' + parametri.MezziRitorno + '&' +
      'Tempo=' + parametri.Tempo

    return this.effettuaChiamata(url);
  }  
}

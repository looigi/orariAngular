import { Injectable } from '@angular/core';

@Injectable()
export class VariabiliGlobali {
  urlWS; //  = 'http://looigi.ddns.net:1081/';
  CaricamentoInCorso = false;
  idUtente = 1;
  
  getDayName(dateStr, locale) {
    let nomeGiorno = dateStr.toLocaleDateString(locale, { weekday: 'long' });
    nomeGiorno = nomeGiorno.substr(0, 1).toUpperCase() + nomeGiorno.substr(1, nomeGiorno.length);
    const giorno = dateStr.getDate();
    const mese = dateStr.getMonth() + 1;
    const anno = dateStr.getFullYear();
    return nomeGiorno + ' ' + giorno + '/' + mese + '/' + anno;
  }

  calcolaGiornoAnno(date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
  }
}

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

  giorniMancanti(dataAttuale) {
    const secondDate = new Date('12/31/' + dataAttuale.getFullYear());
    const firtDateMs = (new Date(dataAttuale)).getTime();
    const secondDateMs = (new Date(secondDate)).getTime();
    // console.log('Giorni mancanti: First date: ' + dataAttuale, 'In ms:' + firtDateMs);
    // console.log('Giorni mancanti: Second date: ' + secondDate, 'In ms:' + secondDateMs);
    const Difference_In_Days = Math.ceil(Math.abs(firtDateMs - secondDateMs) / (1000 * 60 * 60 * 24));
    // console.log("Giorni mancanti: Difference_In_Days: ", Difference_In_Days);

    return Difference_In_Days;
  }

  calcolaGiorniLavorativi(dataAttuale) {
    const giorni = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const anno = dataAttuale.getFullYear();
    const bisestile = !((anno % 4) || (!(anno % 100) && (anno % 400)));
    if (bisestile) {
      giorni[1] = 29;
    }
    const mese = dataAttuale.getMonth();
    const pasqua = this.isEaster(anno);
    // console.log('Calcola Giorni: Pasqua: ', pasqua);
    let lavorativi = 0;
    for (let i = 1; i <= giorni[mese]; i++) {
      const giorno = (mese + 1) + '/' + i + '/' + anno;
      const dateStr = new Date(giorno);
      const nomeGiorno = dateStr.toLocaleDateString("it-IT", { weekday: 'long' });
      let ok = true;
      // console.log('Calcola Giorni: Giorno: ', giorno, nomeGiorno);
      if (giorno === pasqua[1] && mese == pasqua[0]) {
        ok = false;
      } else {
        if (nomeGiorno === 'sabato' || nomeGiorno === 'domenica') {
          ok = false;
        } else {
          if ((mese === 1 && i === 1) ||
              (mese === 5 && i === 1) ||
              (mese === 6 && i === 2) ||
              (mese === 8 && i === 15) ||
              (mese === 11 && i === 1) ||
              (mese === 12 && (i === 8 || i === 25))) {
                ok = false
          } else {
            // console.log('Lavorativo', i, giorno, nomeGiorno);
            lavorativi++;
          }
        }
      }
    }

    return lavorativi;
  }

  isEaster(Y) {
    var C = Math.floor(Y/100);
    var N = Y - 19*Math.floor(Y/19);
    var K = Math.floor((C - 17)/25);
    var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
    J = J - 7*Math.floor(J/7);
    var L = I - J;
    var M = 3 + Math.floor((L + 40)/44);
    var D = L + 28 - 31*Math.floor(M/4);

    return [this.padout(M - 1), this.padout(D)];
  }

  padout(number) { return (number < 10) ? '0' + number : number; }
}

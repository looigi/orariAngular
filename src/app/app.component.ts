import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { HttpClient } from '@angular/common/http';
import { VariabiliGlobali } from './VariabiliGlobali.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Orari';

  dataAttuale;
  nomeGiornoAttuale;
  appoggioDatiGiornata;
  giornoDellAnno;
  datiGiornata;
  oreLavorate;
  // modificaGiorno = false;
  modalitaInsert = false;
  tipoOre = 1;
  dati;
  commesse;
  mezzoAndataScelto;
  mezzoRitornoScelto;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    public VariabiliGlobali: VariabiliGlobali
  ) {

  }

  ngOnInit(): void {
    const d = localStorage.getItem('DataAttuale');
    if (d !== null) {
      this.dataAttuale = new Date(d);
    } else {
      this.dataAttuale = new Date();
    }

    // console.log('Data attuale', this.dataAttuale);

    const url: string = '/assets/connessione.json';
    this.http.get(url).subscribe((response) => {
      console.log(response);

      this.VariabiliGlobali.urlWS = response['indirizzoWS'];
      console.log('Indirizzo WS:', this.VariabiliGlobali.urlWS);

      this.VariabiliGlobali.CaricamentoInCorso = false;

      this.caricaDatiGiornata();
      this.disegnaGiorno();
    });
  }
  
  caricaDatiGiornata() {
    this.apiService.ritornaDatiPerGiornata()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (data) {
              // console.log(data);
              this.dati = JSON.parse(data);
              console.log('Dati', this.dati);
            } else {
              // this.pulisceArray();
            }
          } else {
            // this.pulisceArray();
          }
        }
      }
    );
  }   
  
  caricaCommesse() {
    this.apiService.ritornaCommesse(this.datiGiornata.idLavoro)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (data) {
              // console.log(data);
              this.commesse = JSON.parse(data);
              console.log('Commesse', this.commesse);
            } else {
              // this.pulisceArray();
            }
          } else {
            // this.pulisceArray();
          }
        }
      }
    );
  }   

  leggeGiornataAttuale() {
    const giorno = this.dataAttuale.getDate();
    const mese = this.dataAttuale.getMonth() + 1;
    const anno = this.dataAttuale.getFullYear();
    console.log(this.dataAttuale, giorno, mese, anno);

    this.apiService.ritornaGiornata(giorno, mese, anno)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (data) {
              // console.log(data);
              this.datiGiornata = JSON.parse(data);
              console.log(this.datiGiornata);
              const ore = this.datiGiornata.Quante;
              this.oreLavorate = '';
              switch (ore) {
                case -1:
                  this.tipoOre = -1;
                  this.oreLavorate = 'BOH!';
                  break;
                case -2:
                  this.tipoOre = 2;
                  this.oreLavorate = 'Ferie';
                  break;
                case -3:
                  this.tipoOre = 3;
                  this.oreLavorate = 'Permesso';
                  break;
                case -4:
                  this.tipoOre = 4;
                  this.oreLavorate = 'Malattia';
                  break;
                case -5:
                  this.tipoOre = 5;
                  this.oreLavorate = 'Altro';
                  break;
                case -6:
                  this.tipoOre = 6;
                  this.oreLavorate = 'Giorno lavorato a casa';
                  break;
                default:
                  this.tipoOre = 1;
                  this.oreLavorate = ore;  
              }

              this.caricaCommesse();
            } else {
              this.pulisceArray();
            }
          } else {
            this.pulisceArray();
          }
        }
      }
    );
  }

  pulisceArray() {
    this.datiGiornata = {
      CodCommessa: -1,
      Commessa: "",
      Entrata: "",
      Gradi: "",
      Indirizzo: "",
      Km: "",
      Lavoro: "",
      Misti: "",
      Notelle: "",
      Quante: 0,
      Santo: "",
      Tempo: "",
      idIndirizzo: -1,
      idLavoro: -1
    };
    this.oreLavorate = '';   
    this.tipoOre = 0;
    this.commesse = undefined;
  }

  indietroGiorno() {
    this.dataAttuale.setDate(this.dataAttuale.getDate() - 1);
    localStorage.setItem('DataAttuale', this.dataAttuale);
    this.disegnaGiorno();    
  }

  avantiGiorno() {
    this.dataAttuale.setDate(this.dataAttuale.getDate() + 1);
    localStorage.setItem('DataAttuale', this.dataAttuale);
    this.disegnaGiorno();    
  }

  disegnaGiorno() {
    this.leggeGiornataAttuale();
    this.nomeGiornoAttuale = this.VariabiliGlobali.getDayName(this.dataAttuale, "it-IT");
    this.giornoDellAnno = this.VariabiliGlobali.calcolaGiornoAnno(this.dataAttuale);
  }

  cambioTipoOre(ore) {
    console.log('Tipo ore', ore);
    this.tipoOre = ore;
  }

  apreModifica() {
    this.appoggioDatiGiornata = JSON.parse(JSON.stringify(this.datiGiornata));
    this.modalitaInsert = true;
  }

  salvaGiornata() {
    console.log(this.datiGiornata.Notelle);
    this.modalitaInsert = false;
  }

  annullaModifica() {
    this.datiGiornata = JSON.parse(JSON.stringify(this.appoggioDatiGiornata));
    this.modalitaInsert = false;
  }

  clickLavoro() {
    // console.log(this.datiGiornata.Lavoro);
    this.dati.Lavori.forEach(element => {
      if (element.Lavoro === this.datiGiornata.Lavoro) {
        this.datiGiornata.idLavoro = element.idLavoro;
        this.caricaCommesse();
      }
    });
  }

  clickCommessa() {
    this.commesse.forEach(element => {
      if (element.Descrizione === this.datiGiornata.Commessa) {
        this.datiGiornata.codCommessa = element.idCommessa;
        // console.log('Commessa scelta', this.datiGiornata.codCommessa);
      }
    });
  }

  clickPasticca() {
    /* this.dati.Pasticche.forEach(element => {
      if (element.Pasticca === this.datiGiornata.Pasticca) {
        this.datiGiornata.Pasticca = element.Pasticca;
        // console.log('Commessa scelta', this.datiGiornata.codCommessa);
      }
    }); */
  }

  clickTempo() {

  }

  eliminaPranzo(p) {

  }

  spostaSuPranzo(p) {

  }

  spostaGiuPranzo(p) {

  }

  eliminaMezzoDiAndata(m) {

  }

  spostaSuMezzoDiAndata(m) {

  }

  spostaGiuMezzoDiAndata(m) {
    
  }

  eliminaMezzoDiRitorno(m) {

  }

  spostaSuMezzoDiRitorno(m) {

  }

  spostaGiuMezzoDiRitorno(m) {
    
  }

  clickAggiungeMezzoAndata() {
    console.log('Mezzo di andata da aggiungere: ', this.mezzoAndataScelto)
  }

  clickAggiungeMezzoRitorno() {
    console.log('Mezzo di ritorno da aggiungere: ', this.mezzoRitornoScelto)
  }
}

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
  mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  nomeGiornoAttuale;
  numeroGiornoAttuale;
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
  ricorrenze = '';
  giornoInserito = false;
  mostraCalendario = false;
  immagineTempo = ''; // 'assets/immagini/Tempo/1.png';
  immagineLavoro = '';
  immagineSanto = '';
  oreLavorateMiste = 8;
  orePermessiMiste = 0;
  oreSolidarietaMiste = 0;
  oreMalattiaMiste = 0;
  appoggioTipoOre;
  appoggioOreLavorate;
  descSanto;
  visuaDescSanto = false;

  Utils = {
    linkIcone: 'assets'
}

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

    const giorno = this.dataAttuale.getDate();
    const mese = this.dataAttuale.getMonth() + 1;
    this.immagineSanto = 'assets/immagini/Onomastici/Imm_' + giorno + '_' + mese + '.png';

    // console.log('Data attuale', this.dataAttuale);

    const url: string = '/assets/connessione.json';
    this.http.get(url).subscribe((response) => {
      console.log(response);

      this.VariabiliGlobali.urlWS = response['indirizzoWS'];
      console.log('Indirizzo WS:', this.VariabiliGlobali.urlWS);

      this.VariabiliGlobali.CaricamentoInCorso = false;

      this.caricaDatiGiornata();
      this.disegnaGiorno();

      this.aspettaDati();
    });
  }
  
  aspettaDati() {
    const t = setInterval(() => {
      if (this.dati && this.datiGiornata) {
        this.immagineTempo = '';
        this.dati.Tempi.forEach(element => {
          if (element.Tempo === this.datiGiornata.Tempo) {
            this.immagineTempo = 'assets/immagini/Tempo/' + element.idTempo + '.png';
          }
        });

        this.immagineLavoro = '';
        if (this.tipoOre > -1) {
          this.immagineLavoro = 'assets/immagini/Lavori/' + this.tipoOre + '.jpg';
        }
      }
    }, 500);
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
  
  caricaCommesse(forzaID) {
    let idLavoro = this.datiGiornata.idLavoro;
    if (!this.giornoInserito && !forzaID) {
      idLavoro = this.datiGiornata.LavoroDefault;
    }
    this.apiService.ritornaCommesse(idLavoro)
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

    this.numeroGiornoAttuale = giorno;
    let nomeGiorno = this.VariabiliGlobali.getDayName(this.dataAttuale, "it-IT");
    if (nomeGiorno.indexOf(' ') > -1)  {
      nomeGiorno = nomeGiorno.substring(0, nomeGiorno.indexOf(' ')).trim();
    }
    const nomeMese = this.mesi[this.dataAttuale.getMonth()];
    this.nomeGiornoAttuale = nomeMese + ' ' + anno + ' - ' + nomeGiorno;

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
              this.giornoInserito = this.datiGiornata.GiornoInserito;
              const ore = this.datiGiornata.Quante;
              this.oreLavorate = '';
              this.prendeRicorrenze();
              if (!this.giornoInserito) {
              } else {
                if (ore === -5) {
                  const q = this.datiGiornata.Misti;
                  if (q && q.indexOf(';S') > -1) {
                    const qq = q.split(';');
                    this.oreLavorateMiste = qq[0].replace('N', '');
                    this.orePermessiMiste = qq[1].replace('P', '');
                    this.oreMalattiaMiste = qq[2].replace('M', '');
                    this.oreSolidarietaMiste = qq[4].replace('S', '');
                  } else {
                    this.oreLavorateMiste = this.datiGiornata.OreStandard;
                    this.orePermessiMiste = 0;
                    this.oreSolidarietaMiste = 0;
                    this.oreMalattiaMiste = 0;        
                  }
                }
                this.impostaTipoOre(ore);
              }

              this.caricaCommesse(false);
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

  caricaDescSanto() {
    const giorno = this.dataAttuale.getDate();
    const mese = this.dataAttuale.getMonth() + 1;

    this.apiService.ritornaDescSanto(giorno, mese)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (data) {
              this.descSanto = this.datiGiornata.Santo + '<hr />' + data;

              this.visuaDescSanto = true;
            } else {
              // alert('Nessun valore di ritorno per il salvataggio');
              console.log('Nessun valore santo');
            }
          } else {
            alert(data)
          }
        }
      }
    );  }

  prendeRicorrenze() {
    const rico = this.datiGiornata.Ricorrenze;
    this.ricorrenze = '';
    rico.forEach(element => {
      let desc = element.Descrizione;
      while (desc.indexOf('***S***') > -1) {
        let nome = desc.substring(desc.indexOf('***S***') + 7);
        nome = nome.substring(0, nome.indexOf('***F***'));
        while (nome.indexOf(' ') > -1) {
          nome = nome.replace(' ', '+');
        }
        // console.log(nome);
        desc= desc.replace('***S***', '<a href="https://www.google.com/search?q=' + nome + '" target="_blank">');
      }
      while (desc.indexOf('***F***') > -1) {
        desc= desc.replace('***F***', '</a>');
      }
      this.ricorrenze += element.Anno + ': ' + desc + '<br />';
    });
  }

  pulisceArray() {
    if (this.datiGiornata) {
      this.oreLavorateMiste = this.datiGiornata.OreStandard;
    } else {
      this.oreLavorateMiste = 8;
    }
    this.orePermessiMiste = 0;
    this.oreSolidarietaMiste = 0;
    this.oreMalattiaMiste = 0;        
    this.giornoInserito = false;
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
    const giorno = this.dataAttuale.getDate();
    const mese = this.dataAttuale.getMonth() + 1;
    this.immagineSanto = 'assets/immagini/Onomastici/Imm_' + giorno + '_' + mese + '.png';

    this.leggeGiornataAttuale();
    this.giornoDellAnno = this.VariabiliGlobali.calcolaGiornoAnno(this.dataAttuale);
  }

  cambioTipoOre(ore) {
    if (ore === 1 || ore === -5) {
      if (!this.datiGiornata.Entrata) {
        this.datiGiornata.Entrata = '08:00:00';
      }
      if (ore == -5) {
        if (!this.oreLavorateMiste) {
          if (this.datiGiornata) {
            this.oreLavorateMiste = this.datiGiornata.OreStandard;
          } else {
            this.oreLavorateMiste = 8;
          }
          this.orePermessiMiste = 0;
          this.oreSolidarietaMiste = 0;
          this.oreMalattiaMiste = 0;
        }
      }
    }
    // this.tipoOre = ore;
    this.impostaTipoOre(ore);

    console.log('Tipo ore', ore, this.tipoOre);

    this.aspettaDati();
  }

  impostaTipoOre(ore) {
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
    this.datiGiornata.Quante = ore;
  }

  apreModifica() {
    this.appoggioDatiGiornata = JSON.parse(JSON.stringify(this.datiGiornata));
    
    if (!this.giornoInserito) {
      this.oreLavorate = 8;
      this.datiGiornata.Entrata = '08:00:00';

      this.datiGiornata.idLavoro = this.datiGiornata.LavoroDefault;
      this.dati.Lavori.forEach(element => {
        if (element.idLavoro === this.datiGiornata.LavoroDefault) {
          this.datiGiornata.Lavoro = element.Lavoro;
        }
      });

      this.datiGiornata.CodCommessa = this.datiGiornata.CommessaDefault;
      this.commesse.forEach(element => {
        if (element.idCommessa === this.datiGiornata.CodCommessa) {
          this.datiGiornata.Commessa = element.Descrizione;
        }
      });
    }

    const mezziAndata = this.datiGiornata.MezziStandardAndata;
    const ma = new Array();
    mezziAndata.forEach(element => {
      const idMezzo = element.idMezzo;
      this.dati.Mezzi.forEach(element2 => {
        if (+idMezzo === +element2.idMezzo) {
          const m = {
            Mezzo: element2.Mezzo,
            Dettaglio: element2.Dettaglio
          }
          ma.push(m);
        }
      });
    });
    this.datiGiornata.MezziAndata = JSON.parse(JSON.stringify(ma));  

    const mezziRitorno = this.datiGiornata.MezziStandardRitorno;
    const mr = new Array();
    mezziRitorno.forEach(element => {
      const idMezzo = element.idMezzo;
      this.dati.Mezzi.forEach(element2 => {
        if (+idMezzo === +element2.idMezzo) {
          const m = {
            Mezzo: element2.Mezzo,
            Dettaglio: element2.Dettaglio
          }
          mr.push(m);
        }
      });
    });
    this.datiGiornata.MezziRitorno = JSON.parse(JSON.stringify(mr));
    this.datiGiornata.Portate = new Array();
    this.appoggioTipoOre = this.tipoOre;
    this.appoggioOreLavorate = this.oreLavorate;

    this.modalitaInsert = true;
  }

  salvaGiornata() {
    const giorno = this.dataAttuale.getDate();
    const mese = this.dataAttuale.getMonth() + 1;
    const anno = this.dataAttuale.getFullYear();

    let pranzo = '';
    if (this.tipoOre === 1 || this.tipoOre === 5) {
      this.datiGiornata.Pranzo.forEach(element => {
        pranzo += element.idPortata + ';';
      });
    }

    let pasticca = '';
    if (this.tipoOre === 1 || this.tipoOre === 5) {
      this.dati.Pasticche.forEach(element => {
        if (element.Pasticca === this.datiGiornata.Pasticca) {
          pasticca = element.idPasticca;
        }
      });
    }

    let MezziAndata = '';
    if (this.tipoOre === 1 || this.tipoOre === 5) {
      this.datiGiornata.MezziAndata.forEach(element => {
        const mezzo = element.Mezzo + ' ' + element.Dettaglio;
        this.dati.Mezzi.forEach(element2 => {
          const mezzo2 = element2.Mezzo + ' ' + element2.Dettaglio;
          if (mezzo === mezzo2) {
            MezziAndata += element2.idMezzo + ';';
          }
        });
      });
    }

    let MezziRitorno = '';
    if (this.tipoOre === 1 || this.tipoOre === 5) {
      this.datiGiornata.MezziRitorno.forEach(element => {
        const mezzo = element.Mezzo + ' ' + element.Dettaglio;
        this.dati.Mezzi.forEach(element2 => {
          const mezzo2 = element2.Mezzo + ' ' + element2.Dettaglio;
          if (mezzo === mezzo2) {
            MezziRitorno += element2.idMezzo + ';';
          }
        });
      });
    }

    let tempo = '';
    if (this.tipoOre === 1 || this.tipoOre === 5) {
      this.dati.Tempi.forEach(element => {
        if (element.Tempo === this.datiGiornata.Tempo) {
          tempo = element.idTempo + ';' + this.datiGiornata.Gradi;
        }
      });
      if (tempo === '') {
        tempo = '0;' + this.datiGiornata.Gradi;
      }
    } else {
      tempo = '-1;999';
    }

    let misti = '';
    let Ore = this.datiGiornata.Quante;
    let entrata = this.datiGiornata.Entrata;
    if (this.tipoOre === 5) {
      misti = 'N' + this.oreLavorateMiste + ';P' + this.orePermessiMiste + ';M' + this.oreMalattiaMiste + ';R0;S' + this.oreSolidarietaMiste;
    }

    const record = {
      Giorno: giorno,
      Mese: mese, 
      Anno: anno,
      QuanteOre: Ore,
      Note: this.datiGiornata.Notelle,
      Misti: misti,
      CodCommessa:  this.datiGiornata.CodCommessa,
      Entrata: entrata,
      idLavoro: this.datiGiornata.idLavoro,
      idIndirizzo: this.datiGiornata.idIndirizzo,
      Km: this.datiGiornata.Km,
      Pranzo: pranzo,
      Pasticca: pasticca,
      MezziAndata: MezziAndata,
      MezziRitorno: MezziRitorno,
      Tempo: tempo
    }

    console.log('Dati giornata da salvare: ', record);

    this.apiService.salvaGiornata(record)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (data) {
              this.giornoInserito = true;

              this.modalitaInsert = false;
            } else {
              alert('Nessun valore di ritorno per il salvataggio');
            }
          } else {
            alert(data)
          }
        }
      }
    );

  }

  annullaModifica() {
    if (!this.giornoInserito) {
      this.oreLavorate = '';
      /* this.datiGiornata.Entrata = '';
      this.datiGiornata.idLavoro = -9999;
      this.datiGiornata.Lavoro = '';
      this.datiGiornata.MezziAndata = new Array();
      this.datiGiornata.MezziRitorno = new Array(); */
    }
    this.tipoOre = this.appoggioTipoOre;
    this.oreLavorate = this.appoggioOreLavorate;
    this.datiGiornata = JSON.parse(JSON.stringify(this.appoggioDatiGiornata));
    this.modalitaInsert = false;
  }

  clickLavoro() {
    // console.log(this.datiGiornata.Lavoro);
    this.dati.Lavori.forEach(element => {
      if (element.Lavoro === this.datiGiornata.Lavoro) {
        this.datiGiornata.idLavoro = element.idLavoro;
        this.caricaCommesse(true);
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

  clickPranzo() {
    if (this.datiGiornata.Pranzo) {
      // console.log('Click Pranzo', this.datiGiornata.Pranzo.Portata);      
      let Portata = this.datiGiornata.Pranzo.Portata;
      if (!this.datiGiornata.Pranzo) {
        this.datiGiornata.Pranzo = new Array();
      }
      this.dati.Portate.forEach(element => {
        if (element.Portata === Portata) {
          let ok = true;
          this.datiGiornata.Pranzo.forEach(element => {
            if (Portata === element.Portata) {
              ok = false;
            }
          });
          if (ok) {
            this.datiGiornata.Pranzo.push({
              idPortata: element.idPortata,
              Portata: element.Portata
            });
          }
        }
      });
    }
  }

  clickPasticca() {
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

  impostaData(e) {
    console.log('Data impostata', e);
    this.mostraCalendario = false;
    this.dataAttuale = new Date(e);

    this.disegnaGiorno();
  }

  apreImpostazioni() {

  }

  apreDescSanto() {
    this.caricaDescSanto();
  }
}

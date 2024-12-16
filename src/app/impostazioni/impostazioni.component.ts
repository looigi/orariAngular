import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";

@Component({
  templateUrl: 'impostazioni.component.html',
  selector: 'impostazioni-component',
  styleUrls: ['./impostazioni.component.css']
})

export class Impostazioni implements OnInit, OnChanges {
  @Input() Utils;

  @Output() chiusuraEmit: EventEmitter<string> = new EventEmitter<string>()

  mascheraPortate = false;
  datiPortate;
  mascheraModificaPortata = false;
  rigaSelezionataPortata;

  constructor(
      private VariabiliGlobali: VariabiliGlobali,
      private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  chiusura() {
    this.chiusuraEmit.emit(new Date().toString());
  }

  portate() {
    this.apiService.richiamaPortate()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (data) {
              const dati = JSON.parse(data);
              let rp = false;
              dati.forEach(element => {
                element.Riga = rp;
                rp = !rp;
              });
              this.datiPortate = dati;
              this.rigaSelezionataPortata = undefined;
              this.mascheraPortate = true;
            } else {
              this.datiPortate = undefined;
            }
          } else {
            this.datiPortate = undefined;
          }
        }
      }
    );  
  }

  aggiungePortata() {
    this.rigaSelezionataPortata = { idPortata: -1, Portata: '' };
    this.mascheraModificaPortata = true;
  }

  modificaPortata(p) {
    this.rigaSelezionataPortata = p;
    this.mascheraModificaPortata = true;
  }

  eliminaPortata(p) {
    this.apiService.eliminaPortata(p)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (data) {
              this.rigaSelezionataPortata = undefined;
              this.mascheraModificaPortata = false;
              this.portate();
            } else {
              alert(data);
            }
          }
        }
      }
    );  
  }

  chiusuraPortate() {
    this.mascheraPortate = false;
  }

  salvaPortata() {
    this.apiService.salvaPortata(this.rigaSelezionataPortata)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (data) {
              this.rigaSelezionataPortata = undefined;
              this.mascheraModificaPortata = false;
              this.portate();
            } else {
              alert(data);
            }
          }
        }
      }
    );  
  }
}

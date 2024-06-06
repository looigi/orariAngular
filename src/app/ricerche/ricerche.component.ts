import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  templateUrl: 'ricerche.component.html',
  selector: 'ricerche-component',
  styleUrls: ['./ricerche.component.css']
})

export class Ricerche implements OnInit, OnChanges {
  @Output() dataEmit: EventEmitter<Date> = new EventEmitter<Date>()
  @Output() chiusuraEmit: EventEmitter<string> = new EventEmitter<string>()

  dati;
  nota;
  mesi = ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

  constructor(
    private apiService: ApiService,
    private _sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ricerca() {
    this.apiService.effettuaRicerca(this.nota)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (data) {
              // console.log(data);
              const dati = JSON.parse(data);
              let p = true;
              dati.forEach(element => {
                element['Riga'] = p;
                p = !p;
              });
              this.dati = dati;
              console.log('Dati', this.dati);
            } else {
              this.dati = undefined;
            }
          } else {
            this.dati = undefined;
          }
        }
      }
    );  
  }

  chiusura() {
    this.chiusuraEmit.emit(new Date().toString());
  }

  spostaGiorno(d) {
    const data = d.Mese + '/' + d.Giorno + '/' + d.Anno;
    const data2: Date = new Date(data);
    console.log('Giorno selezionato', d, data, data2);
    this.dataEmit.emit(data2);
  }

  rimpiazzaTesto(nn, u, d) {
    let n = nn;
    
    while (n.indexOf(u) > -1) {
      n = n.replace(u, d);
    }

    return n
  }

  disegnaNota(nt) {
    let n = nt;

    n = this.rimpiazzaTesto(n, "*CRLF*", ". ");
		n = this.rimpiazzaTesto(n, "*CR*", "");
		n = this.rimpiazzaTesto(n, "*LF*", "");
		n = this.rimpiazzaTesto(n, "*2P*", ":");
		n = this.rimpiazzaTesto(n, "*PV*", ";");
		n = this.rimpiazzaTesto(n, "*V2*", '"');
		n = this.rimpiazzaTesto(n, "*QA*", "[");
		n = this.rimpiazzaTesto(n, "*QC*", "]");
		n = this.rimpiazzaTesto(n, "*GA*", "{");
		n = this.rimpiazzaTesto(n, "*GC*", "}");

    const a = n.indexOf(this.nota);
    const inizio = n.substring(0, a);
    const fine = n.substring(a + this.nota.length, n.length);
    const ritorno = inizio + '<span style="background-color: yellow">' + this.nota + '</span>' + fine;
    
    return this._sanitizer.bypassSecurityTrustHtml(ritorno);
  }
}

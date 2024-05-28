import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";

@Component({
    templateUrl: 'modificagiorno.component.html',
    selector: 'modificagiorno-component',
    styleUrls: ['./modificagiorno.component.css']
  })
  
  export class ModificaGiorno implements OnInit, OnChanges {
    @Input() dataAttuale;
    @Input() datiGiornata;

    @Output() visibile: EventEmitter<string> = new EventEmitter<string>();

    nomeGiornoAttuale;
    dataAttuale2;
    giornoDellAnno;
    datiGiornata2;
    dati;

    constructor(
        private VariabiliGlobali: VariabiliGlobali,
        private apiService: ApiService
    ) {
    }

    ngOnInit(): void {
        this.leggeDati();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['dataAttuale'] && changes['dataAttuale'].currentValue) {
            this.dataAttuale2 = changes['dataAttuale'].currentValue;
            this.nomeGiornoAttuale = this.VariabiliGlobali.getDayName(this.dataAttuale2, "it-IT");
            this.giornoDellAnno = this.VariabiliGlobali.calcolaGiornoAnno(this.dataAttuale2);    
        }

        if (changes['datiGiornata'] && changes['datiGiornata'].currentValue) {
            this.datiGiornata2 = changes['datiGiornata'].currentValue;            
        }
    }

    chiudeMaschera() {
        this.visibile.emit(new Date().toString());
    }

    leggeDati() {
        this.apiService.ritornaDatiPerGiornata()
        .map((response: any) => response)
        .subscribe((data2: string | string[]) => {
            if (data2) {
              const data = this.apiService.SistemaStringaRitornata(data2);
              if (data.indexOf('ERROR') === -1) {
                if (data) {
                  console.log(data);
                  this.dati = JSON.parse(data);
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
  }
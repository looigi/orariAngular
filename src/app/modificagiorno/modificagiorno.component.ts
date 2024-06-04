import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";

@Component({
    templateUrl: 'modificagiorno.component.html',
    selector: 'modificagiorno-component',
    styleUrls: ['./modificagiorno.component.css']
  })
  
  export class ModificaGiorno implements OnInit, OnChanges {
    @Input() Utils;
    @Input() rimetteGiornoSelezionato;
    @Input() dataAttuale;

    @Output() cambioRicordaGiornoEmit: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private VariabiliGlobali: VariabiliGlobali,
    ) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    cambioRicordaGiorno() {
      this.rimetteGiornoSelezionato = !this.rimetteGiornoSelezionato;
      localStorage.setItem('RicordaGiorno', this.rimetteGiornoSelezionato ? 'S' : 'N');
  
      if (this.rimetteGiornoSelezionato) {
        const d = localStorage.getItem('DataAttuale');
        if (d !== null) {
          this.dataAttuale = new Date(d);
        } else {
          this.dataAttuale = new Date();
        }
      } else {
        this.dataAttuale = new Date();
      }
  
      this.cambioRicordaGiornoEmit.emit(this.dataAttuale);
    }

    impostaData(e) {
      console.log('Data impostata', e);
      this.dataAttuale = new Date(e);
      if (this.rimetteGiornoSelezionato) {
        localStorage.setItem('DataAttuale', this.dataAttuale);
      }
  
      this.cambioRicordaGiornoEmit.emit(this.dataAttuale);
    }  
  }
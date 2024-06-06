import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";

@Component({
  templateUrl: 'statistiche.component.html',
  selector: 'statistiche-component',
  styleUrls: ['./statistiche.component.css']
})

export class Statistiche implements OnInit, OnChanges {
  @Input() Utils;

  @Output() chiusuraEmit: EventEmitter<string> = new EventEmitter<string>()

  constructor(
      private VariabiliGlobali: VariabiliGlobali,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  chiusura() {
    this.chiusuraEmit.emit(new Date().toString());
  }    
}

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

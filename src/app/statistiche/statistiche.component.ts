import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";
import * as CanvasJS from '../canvasjs.min.js';

@Component({
  templateUrl: 'statistiche.component.html',
  selector: 'statistiche-component',
  styleUrls: ['./statistiche.component.css']
})

export class Statistiche implements OnInit, OnChanges {
  @Input() Utils;

  @Output() chiusuraEmit: EventEmitter<string> = new EventEmitter<string>()

  dati;
  tipoGrafico = 'column';

  constructor(
      private VariabiliGlobali: VariabiliGlobali,
      private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    /* const dati = [
      { x: 1, y: 71, label: 'pp1' },
      { x: 2, y: 55, label: 'pp2' },
      { x: 3, y: 50, label: 'pp3' },
      { x: 4, y: 65, label: 'pp4' },
      { x: 5, y: 92, label: 'pp5', indexLabel: "\u2605 Highest" },
      { x: 6, y: 68, label: 'pp6' },
      { x: 7, y: 38, label: 'pp7' },
      { x: 8, y: 71, label: 'pp8' },
      { x: 9, y: 54, label: 'pp9' },
      { x: 10, y: 60, label: 'pp10' },
      { x: 11, y: 36, label: 'pp11' },
      { x: 12, y: 49, label: 'pp12' },
      { x: 13, y: 21, label: 'pp13', indexLabel: "\u2691 Lowest" }
    ];

    this.creaGrafico('Prova', 'column', dati); */
  }  

  ngOnChanges(changes: SimpleChanges): void {
  }

  chiusura() {
    this.chiusuraEmit.emit(new Date().toString());
  }

  ricerca(Statistica) {
    this.apiService.richiamaStatistica(Statistica)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (data) {
              // console.log('Data', data);
              this.dati = JSON.parse(data);
              console.log('Dati', this.dati);

              this.creaGrafico(Statistica, this.tipoGrafico);
            }
          } else {
            alert(data);
          }
        }
      }
    );  
  }

  creaGrafico(titolo, tipo) {
    /*
    “line”
    “column”
    “bar”
    “area”
    “spline”
    “splineArea”
    “stepLine”
    “scatter”
    “bubble”
    “stackedColumn”
    “stackedBar”
    “stackedArea”
    “stackedColumn100”
    “stackedBar100”
    “stackedArea100”
    “pie”
    “doughnut”
    */

    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light1", // "light1", "light2", "dark1", "dark2"
      title:{
        text: titolo, 
        fontSize: 14, 
        fontFamily: 'Arial'
      },
      axisX: {
        labelFormatter: function (e) {
          return e.label;
        },
        fontWeight: 'normal',
        fontFamily: 'arial',
        labelFontSize: 11,
        labelFontColor: 'black',
        interval: 1,
        labelAngle: 90
      },
      axisY: {
        includeZero: true,
        fontFamily: 'arial',
        labelFontSize: 11,
        labelFontColor: 'black',
      },
      data: [{
        type: tipo, //change type to bar, line, area, pie, etc
        indexLabel: "{y}", //Shows y value on all Data Points
        indexLabelFontColor: "#5A5757",
        indexLabelFontSize: 12,
        indexLabelPlacement: "outside",
        zoomEnabled: true,
        zoomType: 'x',
        dataPoints: this.dati
      }]
    });

    chart.render();
  }
}

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  replaceChar: '_',
  urlBaseGS: 'Geo_ANTS',
  urlBase: 'api/v1',
  clientTypeVersion: 'Debug',
  nomeLogin: 'Luigi.Pecce',
  // pwdLogin: 'cerioni',
  // nomeLogin: 'Luigi.Pecce.29',
  // pwdLogin: 'Lati_01',
  layerPerGraficoNumerico: 'Geo_ANTS:l_geo_measr_num_sample',
  layerPerGraficoStringa: 'Geo_ANTS:l_geo_measr_str_sample',
  layerNumerico: 'Geo_ANTS:l_geo_measr_num_line',
  layerStringa: 'Geo_ANTS:l_geo_measr_str_line',
  // nomeLogin: 'Luigi.Pecce',
  // pwdLogin: 'cerioni',
  // spostamentoMillisecondi: 3600000,
  // spostamentoMillisecondi: 0,
  stringaLatestSelection: '<Latest Selected>',
  stringaAll: '<All>',
  stringaGlobalSettingSLA: '<Global SLA>',
  stringaGlobalSettingMapStyle: '<Global Map Style>',
  stringaClusterGlobale: '<Global Cluster>',
  quantiFrames: 9,
  quantiSottoFrames: 30,
  quantePagine: 30
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


import {throwError as observableThrowError, Observable, of} from 'rxjs';
import 'rxjs/add/operator/catch';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map'
import { VariabiliGlobali } from '../VariabiliGlobali.component';

@Injectable()
export class HttpClientService {
  headers;

  constructor(private http: HttpClient, private variabiliGlobali: VariabiliGlobali) {
    this.headers = new Headers();
  }

  setHeader(header, value) {
    this.headers.append(header, value);
  }

  private catchAuthError(self: HttpClientService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      return observableThrowError(res);
    };
  }

  get(url, params?): Observable<any> {
    if (params) {
      url += params.toString();
    }
    console.log('GET: ', url, params);
    // console.error(t, 'Device: ' + t.deviceGirante);
    // console.error(t, 'Chiamata: ' + url);

    /* if (t.deviceGirante === 'Android') {
      const postHeaders = new HttpHeaders(this.headers);
      postHeaders.append('Content-Type', 'application/text');
      postHeaders.append("Cache-Control", "no-cache");
      postHeaders.append("Access-Control-Allow-Origin", "*");
      postHeaders.append("Access-Control-Allow-Credentials", "true");
      postHeaders.append("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
      postHeaders.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      // console.log('HEADERS', this.headers);

      const HTTPOptions: Object = {
        headers: postHeaders,
        responseType: 'text'
      }

      return this.http.get(
        url, HTTPOptions
      )
      .map(data => { 
        // console.error(t, 'Ritorno funzione Android: ' + url);
        // console.error(t, data);

        return data; 
      })
      .pipe(
        timeout(30000),
        catchError(e => {
          // do something on a timeout
          console.error(t, 'Errore funzione get Android: ' + url);
          console.error(t, JSON.stringify(e));

          return of(null);
          // return e;
        })
      );
    } else { */
      /* return this.http.get(url, {
        search: params,
        headers: this.headers
      }).catch(this.catchAuthError(this)); */

      const HTTPOptions: Object = {
        headers: this.headers,
        responseType: 'text'
      }

      return this.http.get(url,  HTTPOptions)
        .map(data => { 
          // console.error(t, 'Ritorno funzione WEB: ' + url);
          // console.error(t, data);
          this.variabiliGlobali.CaricamentoInCorso = false;
          return data; 
        })
        .pipe(
        timeout(300000),
        catchError(e => {
          this.variabiliGlobali.CaricamentoInCorso = false;
          // do something on a timeout
          // console.error(t, 'Errore funzione get Android: ' + url);
          // console.error(t, JSON.stringify(e));

          return of(null);
          // return e;
        })
      );

      return this.http.get(
        url, {
          headers: this.headers
        }
      )
      .pipe(
        timeout(10000),
        catchError(e => {
          // do something on a timeout
          console.error(this, 'TIMEOUT 2 funzione ' + url);

          return of(null);
          // return e;
        })
      );
    // }
  }

  post(t, url, data) {
    const postHeaders = new Headers(this.headers);
    postHeaders.append('Content-Type', 'application/text');
    
    postHeaders.append("Cache-Control", "no-cache");
    postHeaders.append("Access-Control-Allow-Origin", "*");
    postHeaders.append("Access-Control-Allow-Credentials", "true");
    postHeaders.append("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
    postHeaders.append("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  
    const HTTPOptions: Object = {
      headers: postHeaders,
      responseType: 'text'
    }

    // const body = JSON.stringify(data);
    // return this.http.post(url, body, {headers: postHeaders})

    return this.http.post<any>(url, data, HTTPOptions)
      .map(data => { 
        // console.error(t, 'Ritorno funzione WEB: ' + url);
        // console.error(t, data);
        return data; 
      })
      .pipe(
      // timeout(UtilityComponent.TimeOutConnessione),
      catchError(e => {
        // do something on a timeout
        console.error(t, 'Errore funzione get Android: ' + url);
        console.error(t, JSON.stringify(e));

        return of(null);
        // return e;
      })
    );
      // .catch(this.catchAuthError(this));
  }

  /* post2(url, data, postHeaders) {
    const body = JSON.stringify(data);
    return this.http.post(url, body, {headers: postHeaders})
      .catch(this.catchAuthError(this));
  }

  put(url, data) {
    const putHeaders = new Headers(this.headers);
    putHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.put(url, body, {headers: putHeaders})
      .catch(this.catchAuthError(this));
  }

  delete(url, data) {
    const postHeaders = new Headers(this.headers);
    postHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.delete(url, {headers: postHeaders, body: body})
      .catch(this.catchAuthError(this));
  } */

  async downloadFile(url) {
    const r = await this.http.get(url, this.headers).toPromise();
    // console.log(r);
    return r;
  }
}

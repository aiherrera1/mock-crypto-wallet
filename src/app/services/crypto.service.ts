import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environment/environment';

interface CryptoApiResponse {
  [key: string]: {
    USD: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private apiKey: string = environment.cryptoApiKey;
  private apiUrl: string = environment.cryptoApiUrl;
  private symbols: string = 'BTC,ETH,XRP,BCH,ADA,LTC,XEM,XLM';

  constructor(private http: HttpClient) {}

  getCryptoPrices(): Observable<{ symbol: string; price: number }[]> {
    const params = {
      fsyms: this.symbols,
      tsyms: 'USD',
      api_key: this.apiKey,
    };

    return this.http.get<CryptoApiResponse>(this.apiUrl, { params }).pipe(
      map((response) => {
        const cryptoArray: { symbol: string; price: number }[] = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            cryptoArray.push({
              symbol: key,
              price: response[key].USD,
            });
          }
        }
        return cryptoArray;
      }),
      catchError(this.handleError),
    );
  }

  getCryptoPricesEvery30Seconds(): Observable<
    { symbol: string; price: number }[]
  > {
    return timer(0, 30000).pipe(
      switchMap(() => this.getCryptoPrices()),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('CryptoService Error:', error);
    return throwError('An error occurred while fetching crypto data.');
  }

  buyCrypto(uid: string, symbol: string, price: number): Observable<any> {
    console.log('Buying crypto...');
    return this.http
      .get('http://localhost:3000/crypto-exchange', { responseType: 'text' })
      .pipe(
        map((response) => {
          console.log('Purchase successful:', response);
          console.log(symbol, price);
          // add the response to the user's portfolio
          return response;
        }),
        catchError(this.handleError),
      );
  }
}

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AirtableFields, AirtableRoot, AllDisneyRootObject, AllPokeRootObject, SingleDisneyRootObject, SinglePokeRootObject } from './apiResponseInterfaces';
import { BASE_URL_AIRTABLE, BASE_URL_DISNEY, BASE_URL_POKE } from './app.module';

@Injectable({
  providedIn: 'root'
})
export class ApiLogicService {

  constructor(private http: HttpClient,
    @Inject(BASE_URL_POKE) private baseUrlPoke: string,
    @Inject(BASE_URL_DISNEY) private baseUrlDisney: string,
    @Inject(BASE_URL_AIRTABLE) private baseUrlAirtable: string) { }

  // first 100
  public loadPokeCharacters(): Observable<AllPokeRootObject> {
    return this.http.get<AllPokeRootObject>(`${this.baseUrlPoke}?limit=100&offset=0`);
  }

  // first 50
  public loadDisneyCharacters(): Observable<AllDisneyRootObject> {
    return this.http.get<AllDisneyRootObject>(this.baseUrlDisney);
  }

  public loadPokeCharacterDetails(identifier: string): Observable<SinglePokeRootObject> {
    return this.http.get<SinglePokeRootObject>(`${this.baseUrlPoke}/${identifier}`);
  }

  public loadDisneyCharacterDetails(identifier: string): Observable<SingleDisneyRootObject> {
    return this.http.get<SingleDisneyRootObject>(`${this.baseUrlDisney}/${identifier}`);
  }

  public loadCharactersFromAirtable(): Observable<AirtableRoot> {
    return this.http.get<AirtableRoot>(this.baseUrlAirtable);
  }

  public addCharacterToAirtable(id: string, franchise: string): Observable<AirtableRoot> {
    const character: AirtableFields = {
        id: id,
        franchise: franchise
    };
    const body: AirtableRoot = {
      records: [{ fields: character }],
    };
    return this.http.post<AirtableRoot>(this.baseUrlAirtable, body);
  }

  public deleteCharacterFromAirtable(recordId: string): Observable<unknown> {
    return this.http.delete(`${this.baseUrlAirtable}/${recordId}`);
  }
}

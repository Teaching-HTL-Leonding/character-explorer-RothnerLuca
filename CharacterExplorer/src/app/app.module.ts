import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterListComponent } from './character-list/character-list.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CharacterDetailsComponent } from './character-details/character-details.component';
import { AirtableAuthInterceptor } from './airtable-auth.interceptor';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export const BASE_URL_POKE = new InjectionToken<string>('BASE_URL_POKE');
export const BASE_URL_DISNEY = new InjectionToken<string>('BASE_URL_DISNEY');
export const AIRTABLE_PAT = new InjectionToken<String>('AIRTABLE_PAT');
export const BASE_URL_AIRTABLE = new InjectionToken<string>('BASE_URL_AIRTABLE');

@NgModule({
  declarations: [
    AppComponent,
    CharacterListComponent,
    CharacterDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AirtableAuthInterceptor, multi: true },
    { provide: BASE_URL_POKE, useValue: 'https://pokeapi.co/api/v2/pokemon' },
    { provide: BASE_URL_DISNEY, useValue: 'https://api.disneyapi.dev/characters' },
    { provide: BASE_URL_AIRTABLE, useValue: 'https://api.airtable.com/v0/app9iWaikAF1bUxlt/tblvs5wb3ZFPoy1fw' },
    { provide: AIRTABLE_PAT, useValue: 'YOUR-PAT' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

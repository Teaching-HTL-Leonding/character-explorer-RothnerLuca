import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiLogicService } from '../api-logic.service';
import { AirtableRoot, AllDisneyResult, AllDisneyRootObject, AllPokeResult, AllPokeRootObject, SinglePokeRootObject } from '../apiResponseInterfaces';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {

  pokeDataFromServer?: AllPokeRootObject;
  disneyDataFromServer?: AllDisneyRootObject;
  searchText: string;
  displayedPoke?: AllPokeResult[];
  displayedDisney?: AllDisneyResult[];
  spriteUrlList; // only for pokemon
  favourites;
  dataFromAirtrable?: AirtableRoot;
  view: string;
  hideSpinner: boolean = true;

  constructor(public apiService: ApiLogicService) {
    this.searchText = '';
    this.spriteUrlList = new Map<string, string>();
    this.favourites = new Map<string | number, boolean>();
    this.view = 'all';
  }

  ngOnInit(): void {
    this.searchText = '';
    this.view = 'all';
    this.apiService.loadCharactersFromAirtable().subscribe((data) => {
      this.hideSpinner = false;
      this.dataFromAirtrable = data;

      this.apiService.loadPokeCharacters().subscribe((data) => {
        this.pokeDataFromServer = data;

        for (let result of this.pokeDataFromServer?.results) {
          this.spriteUrlList.set(result.name, '');

          for (let airtableRes of this.dataFromAirtrable!.records) {
            if (airtableRes.fields.id === result.name) {
              this.favourites.set(result.name, true);
            }
          }
        }

        this.apiService.loadDisneyCharacters().subscribe((data) => {
          this.disneyDataFromServer = data;
          for (let res of this.disneyDataFromServer?.data) {
            for (let airtableRes of this.dataFromAirtrable!.records) {
              if (airtableRes.fields.id === res._id) {
                this.favourites.set(res._id, true);
              }
            }
          }
          this.displayAllCharacters();
          this.hideSpinner = true;
        });

        for (let key of this.spriteUrlList.keys()) {
          this.loadSpriteUrlToList(key);
        }
      });

    });

  }

  public toggleFavourites(id: string | number, franchise: string): void {
    if (this.favourites.get(id)) {
      let recId = this.getRecordId(id.toString());
      if (recId) {
        this.apiService.deleteCharacterFromAirtable(recId).subscribe((data) => {
          this.favourites.set(id, false);
          this.ngOnInit();
        });
      } else {
        console.error('Record not found');
      }
    } else {
      this.apiService.addCharacterToAirtable(id.toString(), franchise).subscribe((data) => {
        this.favourites.set(id, true);
        this.ngOnInit();
      });
    }
  }

  private getRecordId(id: string): string | undefined {
    for (let res of this.dataFromAirtrable!.records) {
      if (res.fields.id === id.toString()) {
        return res.id;
      }
    }
    return '';
  }

  public searchForCharacter(): void {
    if (this.searchText !== '') {
      if (this.view === 'all') {
        this.displayedPoke = this.pokeDataFromServer?.results.filter((character) => {
          return character.name.toLowerCase().includes(this.searchText.toLowerCase());
        });
        this.displayedDisney = this.disneyDataFromServer?.data.filter((character) => {
          return character.name.toLowerCase().includes(this.searchText.toLowerCase());
        });
      } else {
        this.displayedPoke = this.pokeDataFromServer?.results.filter((character) => {
          return character.name.toLowerCase().includes(this.searchText.toLowerCase()) && this.favourites.get(character.name);
        });
        this.displayedDisney = this.disneyDataFromServer?.data.filter((character) => {
          return character.name.toLowerCase().includes(this.searchText.toLowerCase()) && this.favourites.get(character._id);
        });
      }
    } else {
      if (this.view === 'all') {
        this.displayAllCharacters();
      } else {
        this.displayFavourites();
      }
    }
  }

  private displayAllCharacters(): void {
    this.displayedPoke = this.pokeDataFromServer?.results;
    this.displayedDisney = this.disneyDataFromServer?.data;
  }

  private displayFavourites(): void {
    this.displayedPoke = this.pokeDataFromServer?.results.filter((character) => {
      return this.favourites.get(character.name);
    });
    this.displayedDisney = this.disneyDataFromServer?.data.filter((character) => {
      return this.favourites.get(character._id);
    });
  }

  private loadSpriteUrlToList(pokeName: string): void {
    this.apiService.loadPokeCharacterDetails(pokeName).subscribe((data) => {
      this.spriteUrlList.set(pokeName, data.sprites.front_default);
    });
  }

  public changeView(view: string): void {
    this.view = view;
    if (view === 'all') {
      this.displayAllCharacters();
    } else {
      this.displayFavourites();
    }
  }
}

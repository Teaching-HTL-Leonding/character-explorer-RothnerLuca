import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiLogicService } from '../api-logic.service';
import { AllDisneyRootObject, AllPokeRootObject } from '../apiResponseInterfaces';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit {

    identifier?: string;
    characterType: string;
    POKE: string = 'poke';
    DISNEY: string = 'disney';
    pokeDataFromServer?: any;
    disneyDataFromServer?: any;
    showPokeDetails!: boolean;

    constructor(private route: ActivatedRoute, private apiService: ApiLogicService) {
      this.characterType = window.location.pathname.includes(this.POKE) ? this.POKE : this.DISNEY;
      this.showPokeDetails = this.characterType === this.POKE;
    }

    ngOnInit(): void {
      if (window.location.pathname.includes(this.POKE)) {
        this.route.params.subscribe((params) => {
          this.identifier = params['name'];
        })
      }
      if (window.location.pathname.includes(this.DISNEY)) {
        this.route.params.subscribe((params) => {
          this.identifier = params['_id'];
        })
      }

      if (this.characterType === this.POKE) {
        this.apiService.loadPokeCharacterDetails(this.identifier!)
          .subscribe((data) => this.pokeDataFromServer = data);
      } else if (this.characterType === this.DISNEY) {
        this.apiService.loadDisneyCharacterDetails(this.identifier!)
          .subscribe((data) => this.disneyDataFromServer = data);
      }
    }

    public returnToPreviousRoute(): void {
      window.history.back();
    }
}

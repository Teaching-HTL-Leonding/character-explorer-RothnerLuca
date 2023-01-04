import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterDetailsComponent } from './character-details/character-details.component';
import { CharacterListComponent } from './character-list/character-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'character-list' },
  { path: 'character-list', component: CharacterListComponent },
  { path: 'character-list/detailed/poke/:name', component: CharacterDetailsComponent },
  { path: 'character-list/detailed/disney/:_id', component: CharacterDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

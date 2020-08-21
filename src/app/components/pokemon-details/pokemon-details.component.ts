import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PokeapiService } from 'src/app/services/pokeapi.service';
import { Pokemon } from 'src/app/interfaces/pokemon';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnInit {

  pokemon: Pokemon;
  constructor(private activatedRoute: ActivatedRoute,
              private pokeApiService: PokeapiService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.pokemon = {}
    this.activatedRoute.params.subscribe( params =>{
      this.pokemon.name = params['pokemonName'];
      this.loadPokemonInfo().then(()=>{
        this.spinner.hide();
      });
    });
  }

  loadPokemonInfo(){
    return new Promise(async(resolve,reject)=>{
      let details = await this.pokeApiService.getPokemonDetailsByName(this.pokemon.name);
      this.pokemon.id = details.id;
      this.pokemon.image = details.sprites.front_default;
      this.pokemon.types = details.types.map( t => t.type.name);
      this.pokemon.height = details.height;
      this.pokemon.weight = details.weight;
      this.pokemon.moves = details.moves.map(m => m.move.name);
      resolve();
    });
  }
}

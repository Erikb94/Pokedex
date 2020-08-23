import { Component, OnInit } from '@angular/core';
import { PokeapiService } from 'src/app/services/pokeapi.service';
import { Pokemon } from 'src/app/interfaces/pokemon';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  public formSearchPokemon: FormGroup;
  listPokemon: Pokemon[];
  index: number;
  auxListPokemon: Pokemon[];
  searching: boolean = false;
  constructor(private pokeApiService: PokeapiService,
              private router: Router,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.formSearchPokemon = this.formBuilder.group({
      txtName:[''],
      txtType:[''] 
    });
    this.spinner.show();
    this.load().then(()=>{
      this.spinner.hide();
    });
  }

  async load(){
    return new Promise(async (resolve,reject)=>{
      let list: any[] = await this.pokeApiService.getPokemonList();
      this.index = 0;
      this.listPokemon = []
      const _for = async () =>{
        for(let i = 0; i< list.length ; i++){
          let details = await this.pokeApiService.getPokemonDetails(list[i].url);
          this.listPokemon.push({
            name: details.name,
            image: details.sprites.front_default,
            types: details.types.map( t => t.type.name)
          });
        }
      };
      await _for();
      this.auxListPokemon = this.listPokemon.slice(this.index*50,(this.index+1)*50);
      resolve();
    });
  }

  async search(){
    try {
      this.spinner.show();  
      this.searching = true
      let name: string = this.formSearchPokemon.controls.txtName.value;
      let type: string = this.formSearchPokemon.controls.txtType.value;
      let reg;
      if(name != ''){
        reg = RegExp(name);
        this.auxListPokemon = this.listPokemon.filter(l => reg.exec(l.name));
      }else if (type != ''){
        reg = RegExp(type);
        this.auxListPokemon = this.listPokemon.filter(l => l.types.filter(t => reg.exec(t)).length > 0);
      }
      this.spinner.hide();      
    } catch (error) {
      this.spinner.hide();      
      console.log(error);
    }
  }

  details(pokemon){
    this.router.navigate([ pokemon.name, 'pokemonDetails' ]);
  }

  onScroll(){
    if(!this.searching){
      this.index++;
      this.auxListPokemon = this.listPokemon.slice(0,(this.index+1)*50);
    }
  }

}

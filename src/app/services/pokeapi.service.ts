import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  
  constructor(private http: HttpClient) { }

  getPokemonList(offset:number = 0, limit: number = 1048):Promise<any[]>{
    return new Promise((resolve, reject)=>{
      this.http.get(`https://pokeapi.co/api/v2/pokemon/?offset=${ offset }&limit=${ limit }`)
      .subscribe((data: any)=>{
        resolve(data.results)
      },(ex)=>{
        reject(ex);
      });  
    });
  }

  getPokemonDetails(url: string): Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get(url)
      .subscribe((data: any)=>{
        resolve(data)
      },(ex)=>{
        reject(ex);
      });
    });
  }
  getPokemonDetailsByName(name: string): Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get(`https://pokeapi.co/api/v2/pokemon/${ name }/`)
      .subscribe((data: any)=>{
        resolve(data)
      },(ex)=>{
        reject(ex);
      });
    });
  }
}

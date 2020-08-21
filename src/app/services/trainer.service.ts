import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  constructor() { }

  addTrainer(user: string, password: string, fullName: string){
    return new Promise((resolve, reject)=>{
      try {
        let usersList: User[] = JSON.parse(sessionStorage.getItem('Users')) == null ? [] : JSON.parse(sessionStorage.getItem('Users'));
        usersList.push({
          user: user,
          password: password,
          fullName: fullName
        });
        sessionStorage.setItem('Users',JSON.stringify(usersList));
        resolve()
      } catch (error) {
        reject(error);
      }
    });
  }

  searchTrainer(user: string):Promise<User[]>{
    return new Promise((resolve, reject)=>{
      try {
        let usersList: User[] = JSON.parse(sessionStorage.getItem('Users')) == null ? [] : JSON.parse(sessionStorage.getItem('Users'));
        if (usersList)
          resolve(usersList.filter(u => u.user == user));
        else
          resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  }

}

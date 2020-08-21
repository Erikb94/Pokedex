import { Component, OnInit } from '@angular/core';
import { TrainerService } from 'src/app/services/trainer.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formLogin: FormGroup;

  constructor(private trainerService: TrainerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      txtEmail:['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      txtPassword:['',[Validators.required,Validators.minLength(8)]] 
    });
  }

  async login(){
    this.spinner.show();
    if(this.formLogin.invalid){
      alert('There are errors in your information, please insert a valid email address and a password');
      this.spinner.hide();
      return;
    }
    let email: string = this.formLogin.controls.txtEmail.value;
    let password: string = btoa(this.formLogin.controls.txtPassword.value);
    
    let users = await this.trainerService.searchTrainer(email);
    if(users.length == 0){
      alert('I could not find you, please register yourself as a new pokemon trainer!');
      this.spinner.hide();
      return;
    }
    if(users.filter(u => u.password == password).length == 0){
      alert('Wrong password, please try again');
      this.spinner.hide();
      return;
    }
    this.router.navigate(['/pokemonList' ]);
    this.spinner.hide();
  }
}

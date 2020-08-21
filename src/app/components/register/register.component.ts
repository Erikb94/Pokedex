import { Component, OnInit } from '@angular/core';
import { TrainerService } from 'src/app/services/trainer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formRegister: FormGroup;

  constructor(private trainerService: TrainerService,
              private router: Router,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.formRegister = this.formBuilder.group({
      txtName:['',[Validators.required,Validators.minLength(4)]],
      txtEmail:['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      txtPassword:['',[Validators.required,Validators.minLength(8)]] ,
      txtChkPassword:['',[Validators.required,Validators.minLength(8)]] 
    });
  }

  async register(){
    try {
      this.spinner.show();
      if(this.formRegister.invalid){
        alert('There are errors in your information, please insert a valid email address');
        this.spinner.hide();
        return;
      }
      let email: string = this.formRegister.controls.txtEmail.value;
      let password: string = (this.formRegister.controls.txtPassword.value);
      let chkPassword: string = (this.formRegister.controls.txtChkPassword.value);
      let fullName: string = this.formRegister.controls.txtName.value;
      if(password != chkPassword){
        alert('Passwords do not match, please check');
        this.spinner.hide();
      }
      let users = await this.trainerService.searchTrainer(email);
      if(users.length > 0){
        alert('There is a trainer with the same email address, please use another.');
        this.spinner.hide();
        return;
      }

      const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
      const lowerLetters = /[a-z]+/.test(password);
      const upperLetters = /[A-Z].*[A-Z]/.test(password);
      const numbers = /[0-9]+/.test(password);
      const symbols = regex.test(password);

      if(!lowerLetters || !upperLetters || !numbers || !symbols){
        alert('Your password is weak, It should have at least 1 lower letter, 2 upper letter 1 number and 1 special character.');
        this.spinner.hide();
        return;
      }
      password = btoa(password);

      await this.trainerService.addTrainer(email,password,fullName);
      this.router.navigate(['/pokemonList' ]);
      this.spinner.hide();
    } catch (error) {
      console.log(error);
    }
  }
  cancel(){
    this.router.navigate(['']);
  }
}

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  login(loginForm: NgForm): void {
  if (loginForm.value.user === 'tcs' && loginForm.value.pwd === 'tcs') {
  localStorage.setItem('username', loginForm.value.user);
  this.router.navigate(['header/dashboard']);
  }
  }

}

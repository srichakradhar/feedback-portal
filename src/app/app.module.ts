import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { SearchFilterPipe} from './searchfilter.pipe';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackserviceService } from './service/feedbackservice.service';

import { GaugeModule } from 'angular-gauge';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'header', component: HeaderComponent, children: [{path: 'dashboard', component: DashboardComponent},
  { path: 'dashboard/:db', component: FeedbackComponent }]},
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', component: LoginComponent }
];

@NgModule({
  declarations: [
    SearchFilterPipe,
    AppComponent,
    DashboardComponent,
    LoginComponent,
    FeedbackComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
     GaugeModule.forRoot()
  ],
  providers: [FeedbackserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }

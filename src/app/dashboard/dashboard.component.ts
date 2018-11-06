import { Component, OnInit } from '@angular/core';
import {FeedbackserviceService} from '../service/feedbackservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

db = [];
dbData = [];
data = {};



  constructor(private feedService: FeedbackserviceService) {
  }


  ngOnInit() {
    this.getDatabases();
}

    getDatabases() {
            this.feedService.getAccuracy().subscribe(
          data => {
            this.db = data['data'];
            for ( let i = 0; i < this.db.length; i++) {
              if (this.db[i].database.trim() !== 'local' && this.db[i].database.trim() !== 'admin') {
                 this.db[i].dbName = this.db[i].database.trim().replace(/_/g, ' ');
              //   this.db[i].accuracy = this.db[i].accuracy.toString() + '%';
                this.dbData.push(this.db[i]);
              }
            }

           });
    }




}

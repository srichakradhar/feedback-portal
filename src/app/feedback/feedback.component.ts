import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FeedbackserviceService} from '../service/feedbackservice.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

databases = '';
collections = 'misclassifieds';
searchdrop = '';
int = '';
db = [];
cl = [];
dbData = [];
clData = [];
intents = [];
feedbackData = [];
feedbackSaveData = [];
feedbackPageData = [];
feedbackSearchDropdown = [];
testData = [];
 saveStatus = '';
 trainStatus = '';
 testStatus = '';
 intRemapColDisplay = true;
 loaderDisplay = false;
 emptyFeed = true;
 emptyTest = true;
 searchText = '';

// filteredItems : Product[];
   pages = 4;
  pageSize = 5;
   pageNumber = 0;
   currentIndex = 1;
   pagesIndex: Array<number>;
   pageStart = 1;
   totalRecords = 0;
   // inputName = '';

  constructor(private feedService: FeedbackserviceService, private _activatedRoute: ActivatedRoute) {
   }

  ngOnInit() {
     this.databases = this._activatedRoute.snapshot.params['db'];
     this.getDatabases();
     if (this.databases !== '') {
     this.getCollections(this.databases);
    }
    if (this.databases !== '' && this.collections !== '' ) {
     this.getFeedbackData(this.collections, this.databases);
     }
  }
      getDatabases() {
            this.feedService.getAccuracy().subscribe(
          data => {
            this.db = data['data'];
            for ( let i = 0; i < this.db.length; i++) {
              if (this.db[i].database.trim() !== 'local' && this.db[i].database.trim() !== 'admin') {
                this.db[i].dbName = this.db[i].database.trim().replace(/_/g, ' ');
                this.dbData.push(this.db[i]);
              }
            }

           });
    }
      getCollections(value) {
        console.log(value);
        this.clData = [];
      this.feedService.getCollections(value).subscribe(
          data => {
            this.cl = data['collections'];
            if (this.cl !== []) {
            for ( let i = 0; i < this.cl.length; i++) {
              if (this.cl[i].name.trim() === 'classifieds') {
               this.clData.push({'name': 'Matched Intents', 'value' : 'classifieds'});
              } else if (this.cl[i].name.trim() === 'unclassifieds') {
               this.clData.push({'name': 'Unmatched Intents', 'value' : 'unclassifieds'});
               } else if (this.cl[i].name.trim() === 'misclassifieds') {
               this.clData.push({'name': 'Mismatched Intents', 'value' : 'misclassifieds'});
            }}}
           });
       }

      getIntents(database) {
      this.feedService.getIntents(database).subscribe(
        data => {
              this.intents = data['intents'];
        }
      );
    }

     getFeedbackData(collection, database) {
        this.emptyFeed = true;
       this.loaderDisplay = true;
       if (collection === 'classifieds') {
       this.intRemapColDisplay = false;
      } else {
         this.intRemapColDisplay = true;
      }
     this.getIntents(database);
      this.feedService.getData(collection, database).subscribe(
        data => {
            this.feedbackData = data['data'];
            this.feedbackPageData = data['data'];
              this.init();
            this.feedbackSearchDropdown = ['User Utterance', 'Intent', 'Entity', 'Output', 'Timestamp'];
            if (this.feedbackData !== [] && this.feedbackData !== null) {
                      this.emptyFeed = false;
                      for (let i = 0; i < this.feedbackData.length; i++) {
                      this.feedbackData[i].ModifiedIntent = '';
              }
        }
              this.feedbackSaveData = [];
             this.loaderDisplay = false;
            }
      );
    }

 createModTable(id, modifiedIntent) {
            if (id !== '' && id !== null && modifiedIntent !== '' && modifiedIntent !== null) {
              if (this.feedbackSaveData === null || this.feedbackSaveData === [] || this.feedbackSaveData.length <= 0) {
               this.feedbackSaveData.push({'id': id, 'selected_Intent': modifiedIntent});
            } else {
                  for (let i = 0; i < this.feedbackSaveData.length; i++ ) {
               if (this.feedbackSaveData[i].id === id) {
                 this.feedbackSaveData[i] = {'id': id, 'selected_Intent': modifiedIntent};
               } else {
                      this.feedbackSaveData.push({'id': id, 'selected_Intent': modifiedIntent});
               }
              }
              }

 } else if (id !== '' && id !== null && (modifiedIntent === '' || modifiedIntent !== null)) {
    if ((this.feedbackSaveData !== null && this.feedbackSaveData !== []) || this.feedbackSaveData.length > 0 ) {
                  for (let i = 0; i < this.feedbackSaveData.length; i++ ) {
               if (this.feedbackSaveData[i].id === id) {
                 this.feedbackSaveData.splice(i, 1);
               }
              }
 }
}
}



     postSaveCall(databases, feedbackSaveData, collections) {
        this.loaderDisplay = true;
       this.feedService.saveCall(databases, feedbackSaveData, collections).subscribe(
        data => {
            if (data.status === 1) {
            this.saveStatus = 'Saved Successfully';
            } else {
              this.saveStatus = 'No data to save';
            }
            this.loaderDisplay = false;
        }
      );
     }

      postTrainCall(databases) {
         this.loaderDisplay = true;
       this.feedService.trainBot(databases).subscribe(
         data => {
            if (data.status === 1) {
                this.trainStatus = 'It may take few minutes for Watson to train. Please wait a while before you query again!';
            } else {
              this.trainStatus = 'Error Occured while training';
            }
             this.loaderDisplay = false;
        }
       );
     }

      postTestCall(databases) {
         this.loaderDisplay = true;
       this.feedService.testBot(databases).subscribe(
         data => {
           this.testData = data['validationData'];
            if (this.testData !== []) {
             this.emptyTest = false;
            }
            this.loaderDisplay = false;
        }
       );
     }


init() {
         this.currentIndex = 1;
         this.pageStart = 1;
         this.pages = 4;

         this.pageNumber = parseInt('' + (this.feedbackPageData.length / this.pageSize), 10);
         this.totalRecords = this.feedbackPageData.length;
         if (this.feedbackPageData.length % this.pageSize !== 0) {
            this.pageNumber ++;
         }

         if (this.pageNumber  < this.pages) {
               this.pages =  this.pageNumber;
         }
         this.refreshItems();
         console.log('this.pageNumber :  ' + this.pageNumber);
   }

  //  FilterByName() {
  //     this.filteredItems = [];
  //     if(this.inputName != ""){
  //           productList.forEach(element => {
  //               if(element.name.toUpperCase().indexOf(this.inputName.toUpperCase())>=0){
  //                 this.filteredItems.push(element);
  //              }
  //           });
  //     }else{
  //        this.filteredItems = productList;
  //     }
  //     console.log(this.filteredItems);
  //     this.init();
  //  }
   fillArray(): any {
      const obj = new Array();
      for (let index = this.pageStart; index < this.pageStart + this.pages; index ++) {
                  obj.push(index);
      }
      return obj;
   }
 refreshItems() {
               this.feedbackData = this.feedbackPageData.slice((this.currentIndex - 1) * this.pageSize,
                (this.currentIndex) * this.pageSize);
               this.pagesIndex =  this.fillArray();
   }
   prevPage() {
      if (this.currentIndex > 1) {
         this.currentIndex --;
      }
      if (this.currentIndex < this.pageStart) {
         this.pageStart = this.currentIndex;
      }
      this.refreshItems();
   }
   nextPage() {
      if (this.currentIndex < this.pageNumber) {
            this.currentIndex ++;
      }
      if (this.currentIndex >= (this.pageStart + this.pages)) {
         this.pageStart = this.currentIndex - this.pages + 1;
      }
      this.refreshItems();
   }
    setPage(index: number) {
         this.currentIndex = index;
         this.refreshItems();
    }

generateExcel() {
        if (this.feedbackData === null || this.feedbackData.length <= 0) {
            return;
        }
this.JSONToCSVConvertor(this.feedbackData, 'Feedback Data Report', true);
}

JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    // If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    const arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

    let CSV = '';
    // Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    // This condition will generate the Label/Header
    if (ShowLabel) {
        let row = '';

        // This loop will extract the label from 1st index of on array
//         for (var index in arrData[0]) {
//             //Now convert each value to string and comma-seprated
//             row += index + ',';
// }

        for (let index = 0; index < Object.keys(arrData[0]).length; index++) {
            // Now convert each value to string and comma-seprated
            row += Object.keys(arrData[0])[index] + ',';
}

        row = row.slice(0, -1);

        // append Label row with line break
        CSV += row + '\r\n';
    }

    // 1st loop is to extract each row
    for (let i = 0; i < arrData.length; i++) {
        let row = '';

        // 2nd loop will extract each column and convert it in string comma-seprated
//         for (var index in arrData[i]) {
//             row += '"' + arrData[i][index] + '",';
// }
        for (let index = 0; index < Object.keys(arrData[i]).length; index++) {
            // Now convert each value to string and comma-seprated
           row += '"' + arrData[i][Object.keys(arrData[i])[index]] + '",';
}

        row.slice(0, row.length - 1);

        // add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV === '') {
        alert('Invalid data');
        return;
    }
    // Generate a file name
    let fileName = 'Report_';
    // this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, '_');

    // Initialize file format you want csv or xls
    const uri = 'data:text/csv;charset=utf-8,' + encodeURI(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    // this trick will generate a temp <a /> tag
    const link = document.createElement('a');
    link.href = uri;

    // set the visibility hidden so it will not effect on your web-layout
    // link.style = 'visibility:hidden';
    link.download = fileName + '.csv';

    // this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
}






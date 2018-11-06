import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FeedbackserviceService {

  constructor(private _http: HttpClient) { }

     urlGetDatabases =  'http://localhost:8005/api/getDatabases';
     urlGetAccuracy =  'http://localhost:8005/api/getAccuracy';
     urlGetCollections = 'http://localhost:8005/api/getCollections';
     urlGetData = 'http://localhost:8005/api/getData';
     urlGetIntents = 'http://localhost:8005/api/getIntents';
     urlTrainBot = 'http://localhost:8005/api/trainBot';
     urlTestBot = 'http://localhost:8005/api/testBot';
     urlPutModifiedIntents = 'http://localhost:8005/api/putModifiedIntents';

getAccuracy(): Observable<any> {
      return this._http.post(this.urlGetAccuracy, {responseType: 'json'});
}

     getCollections(databaseSelected): Observable<any> {
         const paramDb = {database: databaseSelected};
      return this._http.post(this.urlGetCollections, {responseType: 'json', params: paramDb });
}

  getData(clSelected, dbSelected): Observable<any> {
   const paramDbCl = { collection: clSelected, database: dbSelected };
    return this._http.post(this.urlGetData, {responseType: 'json', params: paramDbCl });
  }

  getIntents(dbSelected): Observable<any> {
    const paramDb = {database: dbSelected};
    return this._http.post(this.urlGetIntents, {responseType: 'json', params: paramDb });
  }

  trainBot(dbSelected): Observable<any> {
     const paramDb = {database: dbSelected};
    return this._http.post(this.urlTrainBot,  {responseType: 'json', params: paramDb});
  }
    testBot(dbSelected): Observable<any> {
     const paramDb = {database: dbSelected};
    return this._http.post(this.urlTestBot,  {responseType: 'json', params: paramDb});
  }

   saveCall(dbSelected, modTableData, clSelected): Observable<any> {
    // const modTableData = [];
    // for (let i = 0; i < tableData.length; i++) {
    //   if (tableData[i].ModifiedIntent !== undefined) {
    //     modTableData.push({id: tableData[i]._id , selected_Intent: tableData[i].ModifiedIntent.trim() });
    //   }}
     const params = {modifiedTable : modTableData, database: dbSelected, collection: clSelected };
    return this._http.post(this.urlPutModifiedIntents,  {responseType: 'json', params: params});
  }

}

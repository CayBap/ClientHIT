import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp } from '@angular/http';

import 'rxjs';
import { config } from '../config';
import { Observable } from 'rxjs';

@Injectable()
export class ProblemService {
  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  private heroesUrl = config.Url + '/api/problem';

  constructor(private http: Http) { }
  public checkLogin(token: string): Promise<any> {

    var url = this.heroesUrl + '/check';

    this.headers.set('x-access-token', token);
    return this.http
      .get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(err => this.handleError);
  }


  public Update(data): Promise<any> {
    let Url = this.heroesUrl + "/"+data._id;
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('data', JSON.stringify(data));

    return this.http
      .put(Url,urlSearchParams.toString() , { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  public Add(data): Promise<any> {
    let Url = this.heroesUrl ;
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('data', JSON.stringify(data));

    return this.http
      .post(Url, urlSearchParams.toString(), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }


  public GetQuestions(page:number,limit:number,){
      let url = this.heroesUrl + '/?page='+page+'&limit='+limit;
      return this.http.get(url,{headers:this.headers}).toPromise()
      .then(res=>res.json())
      .catch(this.handleError);
  }
  public GetQuestionById (id:string){
      let url = this.heroesUrl + '/'+id;
      return this.http.get(url,{headers:this.headers}).toPromise()
      .then(res=>res.json())
      .catch(this.handleError);
  }
  public DeleteQuestion(id:string){
      let url = this.heroesUrl +"/"+id;
      return this.http.delete(url,{headers:this.headers}).toPromise()
      .then(res=>res.json())
      .catch(this.handleError);
  }

  postFile(fileToUpload: File): Promise<any> {
    let url = this.heroesUrl + '/submit';
    let formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    console.log(formData)
    return this.http
      .post(url, formData, { headers: this.headers }).toPromise().then(res=>res.json())
}
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
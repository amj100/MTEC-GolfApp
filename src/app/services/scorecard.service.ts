import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Course } from '../interfaces/course';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class ScorecardService {
	players: Player[] = []
	course: string = ""
	tee: string = ""
	scorecard: object = {}

	constructor(
		private http: HttpClient,
	) { }
	getScorecard(): Observable<object> {
		return this.http.get("https://golf-courses-api.herokuapp.com/courses" + this.course)
	}
}

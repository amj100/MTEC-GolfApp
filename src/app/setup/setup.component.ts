import { Component, OnInit } from '@angular/core';
import { Player } from '../interfaces/player';
import { Course } from '../interfaces/course';
import { MatDialog } from '@angular/material/dialog';
import { NewPlayerComponent } from './new-player/new-player.component';
import { GolfCoursesApiService } from '../services/golf-courses-api.service';
import { ScorecardService } from '../services/scorecard.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-setup',
	templateUrl: './setup.component.html',
	styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

	players: Player[] = []
	colors: object = {
		"Black": "#333333",
		"Blue": "#3c5591",
		"Red": "#913c3c",
		"Yellow": "#c1ba47",
		"Green": "#3b5f41"
	}
	courses: Course[] = []
	course: string = ""
	tees: string[] = ["Pro", "Champion", "Men", "Women"]
	tee: string = ""
	continueGame = ""

	constructor(
		public dialog: MatDialog,
		public golfCoursesApiService: GolfCoursesApiService,
		public scorecardService: ScorecardService,
		private router: Router
	) { }
	ngOnInit(): void {
		this.golfCoursesApiService.getCourses().subscribe(data => {
			this.courses = data["courses"]
		})
	}
	newPlayer(): void {
		let availableColors: string[] = []
		let usedNicknames: string[] = this.players.map(p => p["name"])
		Object.keys(this.colors).forEach((c) => {
			let available = true
			this.players.forEach(p => {
				if (p["color"] === c) {
					available = false
				}
			})
			if (available) {
				availableColors.push(c)
			}
		})
		const dialogRef = this.dialog.open(NewPlayerComponent, {
			width: "300",
			disableClose: false,
			data: {
				nicknames: usedNicknames,
				colors: availableColors,
				charLimit: 3
			}
		})
		dialogRef.afterClosed().subscribe(result => {
			if (typeof result !== "undefined") {
				this.players.push({
					name: result["nickname"],
					color: result["color"],
					score: []
				})
			}
		})
	}
	removePlayer(n) {
		this.players.forEach((p, i) => {
			if (p["name"] === n) {
				this.players.splice(i, 1)
			}
		})
	}
	changeCourse(c) {
		this.course = c
	}
	changeTee(t) {
		this.tee = t
	}
	continueFirebaseChange() {
		this.continueGame = (<HTMLInputElement>document.getElementById("continueFirebaseCode")).value
	}
	newGame() {
		this.scorecardService.course = this.course
		this.scorecardService.tee = this.tee
		this.scorecardService.players = this.players
		this.router.navigate(['/scorecard'])
	}
}

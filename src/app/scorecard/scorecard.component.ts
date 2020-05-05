import { Component, OnInit } from '@angular/core';
import { GolfCoursesApiService } from '../services/golf-courses-api.service';
import { ScorecardService } from '../services/scorecard.service';
import { Router } from '@angular/router';
import { Player } from '../interfaces/player';

@Component({
	selector: 'app-scorecard',
	templateUrl: './scorecard.component.html',
	styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {
	firebaseCode = ""
	players: Player[] = []
	scorecard: object = {}
	tee: string = ""
	name: string = ""
	colors: object = {
		"Black": "#333333",
		"Blue": "#3c5591",
		"Red": "#913c3c",
		"Yellow": "#c1ba47",
		"Green": "#3b5f41"
	}
	par = []
	yards = []
	hcp = []

	constructor(
		public golfCoursesApiService: GolfCoursesApiService,
		public scorecardService: ScorecardService,
		private router: Router
	) { }

	ngOnInit(): void {
		if (this.scorecardService.scorecardReady()) {
			this.tee = this.scorecardService.tee
			this.players = this.scorecardService.players
			this.players.forEach(p => p["score"] = Array(18).fill(0))
			this.scorecardService.getScorecard().subscribe(data => {
				this.scorecard = data["data"] ? data["data"] : data
				this.name = this.scorecard["name"]
				this.scorecard["holes"].forEach(hole => {
					hole["teeBoxes"].forEach(tee => {
						if (tee["teeType"].toLowerCase() == this.tee.toLowerCase()) {
							this.par.push(tee["par"])
							this.yards.push(tee["yards"])
							this.hcp.push(tee["hcp"])
						}
					})
				})
			})
		}
		else {
			this.router.navigate(["/setup"])
		}
	}
	exitGame() {
		this.router.navigate(["/setup"])
	}
	addArray(a) {
		let num: number = 0
		a.forEach(e => num += Number(e))
		return num
	}
	checkInput(id, e) {
		(<HTMLInputElement>document.getElementById(id)).value = e <= 0 ? 0 : e
		console.log(this.players)
	}

}

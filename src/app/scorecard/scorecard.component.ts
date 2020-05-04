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
	players: Player[] = []
	scorecard: object = {}
	tee: string = ""

	constructor(
		public golfCoursesApiService: GolfCoursesApiService,
		public scorecardService: ScorecardService,
		private router: Router
	) { }

	ngOnInit(): void {
		if (this.scorecardService.scorecardReady()) {
			this.tee = this.scorecardService.tee
			this.players = this.scorecardService.players
			this.scorecardService.getScorecard().subscribe(data => {
				this.scorecard = data["data"] ? data["data"] : data
			})
		}
		else {
			this.router.navigate(["/setup"])
		}
	}

}

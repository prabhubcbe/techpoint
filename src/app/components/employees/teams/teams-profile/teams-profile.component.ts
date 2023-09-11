import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { BubbleChartModel } from 'src/app/components/d3-charts/data/data.model';
import { ServerService } from 'src/app/server/server.service';

@Component({
  selector: 'app-teams-profile',
  templateUrl: './teams-profile.component.html',
  styleUrls: ['./teams-profile.component.scss'],
})
export class TeamsProfileComponent {
  organizationCode = localStorage.getItem('org-code');
  organizationName = localStorage.getItem('organization');
  loginEmail = localStorage.getItem('loginEmail');
  pageEvent: PageEvent = new PageEvent();
  bubbleChartData: any[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor( public api: ServerService, private cdr: ChangeDetectorRef, private http: HttpClient) {
   this.getBubbleChartData();
  }

  private getBubbleChartData() {
    const data = {
      "email": this.loginEmail,
      "organization": this.organizationName,
      "orgCode": this.organizationCode
    };

    this.api.getCandidateOrgBubbleChartData(data)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe({
        next: (res: any) => {
          var response = res.data.map((item: any) => ({
            score: item.score,
            email: item.userId,
            branch: item.designation,
            dept: item.department
          }));

          var ranges: any[] = [
            { key: 100, display: '10%', topText: 'Perfect Fit', uniqueScores: [], min: 80, max: 100, count: 0, records: [] },
            { key: 80, display: '20%', topText: 'Good Fit', uniqueScores: [], min: 60, max: 79, count: 0, records: [] },
            { key: 60, display: '10%', topText: 'Neutral', uniqueScores: [], min: 40, max: 59, count: 0, records: [] },
            { key: 40, display: '20%', topText: 'Poor Fit', uniqueScores: [], min: 20, max: 39, count: 0, records: [] },
            { key: 20, display: '60%', topText: 'Unfit', uniqueScores: [], min: 0, max: 19, count: 0, records: [] },
          ];
          response.map((item: BubbleChartModel) => {
            const data2 = ranges.find(
              (i) => item.score >= i.min && item.score <= i.max
            );
            if (data2) {
              data2.records.push(item);
              data2.count += 1;
              if (!data2.uniqueScores.includes(item.score)) {
                data2.uniqueScores.push(item.score);
              }
            }
          });
          ranges.map((r) => {
            r.display =
              r.count ? Math.round((r.count * 100) / response.length) : 0;
            const uniqueScores = r.uniqueScores.sort();
            const firstPart = Math.round(uniqueScores.length / 2);
            const sum = uniqueScores.slice(0, firstPart).reduce((a: any, b: any) => a + b, 0);
            const sum2 = uniqueScores.slice(firstPart).reduce((a: any, b: any) => a + b, 0);
            r.averageScores = [{ average: (Math.round(sum / firstPart) || 0), count: firstPart },
            { average: (Math.round(sum2 / (uniqueScores.length - firstPart)) || 0), count: uniqueScores.length - firstPart }];
          });
          this.bubbleChartData = ranges;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('API error:', error);
          // Handle the error here, for example, display an error message
        },
      });
  }

  ngOnDestroy(): void {
    console.log('applicants component destroyed');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

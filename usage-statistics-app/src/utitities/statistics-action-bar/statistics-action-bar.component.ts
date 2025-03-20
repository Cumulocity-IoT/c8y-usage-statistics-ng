import { Component, Input, OnInit } from '@angular/core';
import { AlertService, gettext } from '@c8y/ngx-components';
import { CommonService, FeatureList } from '../../common.service';

@Component({
  selector: 'statistics-action-bar',
  templateUrl: './statistics-action-bar.component.html',
  styleUrls: ['./statistics-action-bar.component.css']
})
export class StatisticsActionBarComponent implements OnInit {
  @Input() feature: FeatureList;
  constructor(
    private alert: AlertService,
    private commonService: CommonService
  ) { }
  aggregationActive = false;
  ngOnInit(): void {
  }
  async ngAfterViewInit() {
    if (!sessionStorage.getItem("isFirstSession")) {
      this.alert.warning(gettext('Usage Statistics should be used for indicative purposes only. Billable metrics may be different than the data shown below.'));
      sessionStorage.setItem("isFirstSession", "no");
    }

    let aggregationActive = await this.commonService.isMetricsAggregatorAvailable()
      if (typeof aggregationActive === "boolean" && aggregationActive){}
      else{
        aggregationActive = false;
      }
  }
}

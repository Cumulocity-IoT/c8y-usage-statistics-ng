import { Injectable } from '@angular/core';
import { TabFactory, Tab } from '@c8y/ngx-components';
import { Router } from '@angular/router';

@Injectable()
export class UsageStatisticsTabFactory implements TabFactory {
    constructor(public router: Router) { }
    get() {
        const tabs: Tab[] = [];

        if (this.router.url.match(/microservice-statistics\/overview/g)) {
            tabs.push({
                path: 'microservice-statistics/overview/category-overview',
                priority: 2,
                label: 'Category Overview',
                icon: 'bar-chart'
            } as Tab);
            tabs.push({
                path: 'microservice-statistics/overview/services-overview',
                priority: 1,
                label: 'Services Overview',
                icon: 'pie-chart'
            } as Tab);
        }

        return tabs;
    }
}

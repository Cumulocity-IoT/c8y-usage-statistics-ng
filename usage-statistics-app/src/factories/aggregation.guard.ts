import { CanActivateFn } from '@angular/router';
import { CommonService } from '../common.service';
import { inject } from '@angular/core';


export  const  aggregationAvailable: CanActivateFn = (route, state) => {
   return inject(CommonService).isMetricsAggregatorAvailable()
};

import { Component } from "@angular/core";
import { CellRendererContext } from "@c8y/ngx-components";

@Component({
  template: `
    <span>{{ categoryName }}</span>
  `,
})
export class MicroserviceCategoryCellRendererComponent {
  categoryName: string;

  constructor(
    public context: CellRendererContext,
  ) {
    // this will be updated later
    const map = {
      "databroker-agent-server": "Product Services",
      "zementis-large": "Custom Microservices",
      "billing-aggregation": "Custom Microservices",
      "billing-fetcher": "Custom Microservices"
    }

    this.categoryName = map[context.value] || "Custom Microservices";
  }
}


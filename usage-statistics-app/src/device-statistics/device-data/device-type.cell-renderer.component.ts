import { Component } from "@angular/core";
import { CellRendererContext } from "@c8y/ngx-components";

@Component({
  standalone: false,
  template: `
    <span>{{ context.value }}</span>
  `,
})
export class DeviceTypeCellRendererComponent {
  constructor(
    public context: CellRendererContext,
  ) {}
}

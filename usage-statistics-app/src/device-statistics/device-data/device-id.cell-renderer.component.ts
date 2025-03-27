import { Component } from "@angular/core";
import { CellRendererContext } from "@c8y/ngx-components";

@Component({
  template: `
    <a
      href="{{ context.item.domain }}{{ context.value }}"
      [title]="context.value"
      class="interact"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ context.value }}
    </a>
  `,
})
export class DeviceIdCellRendererComponent {
  constructor(
    public context: CellRendererContext,
  ) {}
}

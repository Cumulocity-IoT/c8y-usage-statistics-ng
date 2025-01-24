import { Component } from '@angular/core';
import { CellRendererContext } from '@c8y/ngx-components';
import { NumberPipe } from "@c8y/ngx-components";

@Component({
    templateUrl: './number.renderer.component.html'
})
export class NumberRendererComponent {
  constructor(public context: CellRendererContext) {
  }
}
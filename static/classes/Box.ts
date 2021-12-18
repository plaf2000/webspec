

import { Coord } from "./Coord";
import { xPx, xUnit, yPx, yUnit } from "./Units";
import { Values } from "./Values";
import { View } from "./View";







export class Box<xU extends xUnit,yU extends yUnit> {
  s: Coord<xU,yU>;
  e: Coord<xU,yU>;

  constructor(s: Coord<xU,yU>, e: Coord<xU,yU>) {
    this.s = s;
    this.e = e;
  }

  isHover(x: xPx, y: yPx) {
    return x >= this.s.x.convert(xPx) && x <= this.e.x && y >= this.s.y && y <= this.e.y;
  }

  isHoverStrict(x: number, y: number) {
    return x > this.s.x && x < this.e.x && y > this.s.y && y < this.e.y;
  }
}

export class DrawableBox extends Box {
  view: View;
  constructor(view: View, pxCoord: PxCoord) {
    super(pxCoord);
    this.view = view;
  }

  updatetf() {}
}

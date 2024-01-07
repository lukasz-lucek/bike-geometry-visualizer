import { fabric } from 'fabric';
import { Point2d } from "./Point2d";
import { Canvas } from 'fabric/fabric-impl';

// Define the Vec2D class that implements Point2d
export class Vec2D implements Point2d {
  x: number;
  y: number;

  constructor(a: number, b: number) {
    this.x = a;
    this.y = b;
  }

  add(a: Vec2D): Vec2D {
    return new Vec2D(this.x + a.x, this.y + a.y);
  }

  angleBetween(v: Vec2D, faceNormalize?: boolean): number {
    if (faceNormalize === undefined) {
      var dot = this.dot(v);
      return Math.acos(dot);
    }
    var theta = faceNormalize ? this.getNormalized().dot(v.getNormalized()) : this.dot(v);
    return Math.acos(theta);
  }

  distanceToSquared(v: Vec2D): number {
    if (v !== undefined) {
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      return dx * dx + dy * dy;
    } else {
      return NaN;
    }
  }

  dot(v: Vec2D): number {
    return this.x * v.x + this.y * v.y;
  }

  getNormalized(): Vec2D {
    return new Vec2D(this.x, this.y).normalize();
  }

  getPerpendicular(): Vec2D {
    return new Vec2D(this.x, this.y).perpendicular();
  }

  interpolateTo(v: Vec2D, f: number): Vec2D {
    return new Vec2D(this.x + (v.x - this.x) * f, this.y + (v.y - this.y) * f);
  }

  normalize(): Vec2D {
    var mag = this.x * this.x + this.y * this.y;
    if (mag > 0) {
      mag = 1.0 / Math.sqrt(mag);
      this.x *= mag;
      this.y *= mag;
    }
    return this;
  }

  normalizeTo(len: number): Vec2D {
    var mag = Math.sqrt(this.x * this.x + this.y * this.y);
    if (mag > 0) {
      mag = len / mag;
      this.x *= mag;
      this.y *= mag;
    }
    return this;
  }

  perpendicular(): Vec2D {
    var t = this.x;
    this.x = -this.y;
    this.y = t;
    return this;
  }

  scale(a: number): Vec2D {
    return new Vec2D(this.x * a, this.y * a);
  }

  sub(a: Vec2D): Vec2D {
    return new Vec2D(this.x - a.x, this.y - a.y);
  }
}

export class Line2D {
  a: Vec2D;
  b: Vec2D;

  constructor(a: Point2d, b: Point2d) {
    this.a = new Vec2D(a.x, a.y);
    this.b = new Vec2D(b.x, b.y);
  }

  intersectLine(l: Line2D): LineIntersection {
    let isec: LineIntersection;
    const denom = (l.b.y - l.a.y) * (this.b.x - this.a.x) - (l.b.x - l.a.x) * (this.b.y - this.a.y);
    const na = (l.b.x - l.a.x) * (this.a.y - l.a.y) - (l.b.y - l.a.y) * (this.a.x - l.a.x);
    const nb = (this.b.x - this.a.x) * (this.a.y - l.a.y) - (this.b.y - this.a.y) * (this.a.x - l.a.x);

    if (denom !== 0) {
      const ua = na / denom;
      const ub = nb / denom;

      if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
        isec = new LineIntersection(LineIntersectionType.INTERSECTING, this.a.interpolateTo(this.b, ua));
      } else {
        isec = new LineIntersection(LineIntersectionType.NON_INTERSECTING, this.a.interpolateTo(this.b, ua));
      }
    } else {
      if (na === 0 && nb === 0) {
        isec = new LineIntersection(LineIntersectionType.COINCIDENT, undefined);
      } else {
        isec = new LineIntersection(LineIntersectionType.COINCIDENT, undefined);
      }
    }

    return isec;
  }
}

export class LineIntersection {
  type: LineIntersectionType;
  pos?: Vec2D;

  constructor(type: LineIntersectionType, pos?: Vec2D) {
    this.type = type;
    this.pos = pos;
  }
}

export enum LineIntersectionType {
  COINCIDENT = 0,
  PARALLEL = 1,
  NON_INTERSECTING = 2,
  INTERSECTING = 3,
}

export class MathUtils {
	static getPointInQuadraticCurve(t : number, p1 : Point2d, pc: Point2d, p2: Point2d) : Vec2D {
		var x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * pc.x + t * t * p2.x;
		var y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * pc.y + t * t * p2.y;
		
		return new Vec2D(x, y);
	}

  	// http://stackoverflow.com/questions/12810765/calculating-cubic-root-for-negative-number
	static cbrt (x : number) : number {
		var sign = x === 0 ? 0 : x > 0 ? 1 : -1;
		return sign * Math.pow(Math.abs(x), 1/3);
	}

	// http://microbians.com/math/Gabriel_Suchowolski_Quadratic_bezier_offsetting_with_selective_subdivision.pdf
	// http://www.math.vanderbilt.edu/~schectex/courses/cubic/
	static getNearestPoint(p1 : Vec2D, pc : Vec2D, p2 : Vec2D) : number {
		var v0 = pc.sub(p1);
		var v1 = p2.sub(pc);

		var a = v1.sub(v0).dot(v1.sub(v0));
		var b = 3 * (v1.dot(v0) - v0.dot(v0));
		var c = 3 * v0.dot(v0) - v1.dot(v0);
		var d = -1 * v0.dot(v0);

		var p = -b / (3 * a);
		var q = p * p * p + (b * c - 3 * a * d) / (6 * a * a);
		var r = c / (3 * a);

		var s = Math.sqrt(q * q + Math.pow(r - p * p, 3));
		var t = MathUtils.cbrt(q + s) + MathUtils.cbrt(q - s) + p;

		return t;
	}
}

export class SplineSegment {
  private start: Vec2D;
  private end: Vec2D;
  private control: Vec2D;
  private thickness: number;

  private split: boolean;
  private ca?: Vec2D;
  private cb?: Vec2D;
  private p1a?: Vec2D;
	private p1b?: Vec2D;
	private p2a?: Vec2D;
	private p2b?: Vec2D;

  private qa?: Vec2D;
  private qb?: Vec2D;
  private q1a?: Vec2D;
  private q2a?: Vec2D;
  private q1b?: Vec2D;
  private q2b?: Vec2D;

  constructor(start: Vec2D, end: Vec2D, control: Vec2D, thickness: number) {
    this.start = start;
    this.end = end;
    this.control = control;
    this.thickness = thickness;
    this.split = false;

    this.calculateIntermediatePoins();
  }

  getStart() : Vec2D {return this.start;}
  setStart(start: Vec2D) {this.start = start; this.calculateIntermediatePoins();}
  getEnd() : Vec2D {return this.end;}
  setEnd(end: Vec2D) {this.end = end; this.calculateIntermediatePoins();}
  getControl() : Vec2D {return this.control;}
  setControl(control: Vec2D) {this.control = control; this.calculateIntermediatePoins();}
  getThickness() : number {return this.thickness;}
  setThickness(thickness: number) {this.thickness = thickness; this.calculateIntermediatePoins();}

  private calculateIntermediatePoins() {
    const p1 = this.start;
		const p2 = this.end;
		const c = this.control;

		const v1 = c.sub(p1);
		const v2 = p2.sub(c);

		const n1 = v1.normalizeTo(this.thickness).getPerpendicular();
		const n2 = v2.normalizeTo(this.thickness).getPerpendicular();

		this.p1a = p1.add(n1);
		this.p1b = p1.sub(n1);
		this.p2a = p2.add(n2);
		this.p2b = p2.sub(n2);

		const c1a = c.add(n1);
		const c1b = c.sub(n1);
		const c2a = c.add(n2);
		const c2b = c.sub(n2);

		const line1a = new Line2D(this.p1a, c1a);
		const line1b = new Line2D(this.p1b, c1b);
		const line2a = new Line2D(this.p2a, c2a);
		const line2b = new Line2D(this.p2b, c2b);

		this.split = (v1.angleBetween(v2, true) > Math.PI / 2);

		if (!this.split) {
			this.ca = line1a.intersectLine(line2a).pos;
			this.cb = line1b.intersectLine(line2b).pos;
		}
		else {
			const t = MathUtils.getNearestPoint(p1, c, p2);
			const pt = MathUtils.getPointInQuadraticCurve(t, p1, c, p2);

			const t1 = p1.scale(1 - t).add(c.scale(t));
			const t2 = c.scale(1 - t).add(p2.scale(t));

			const vt = t2.sub(t1).normalizeTo(this.thickness).getPerpendicular();
			this.qa = pt.add(vt);
			this.qb = pt.sub(vt);

			var lineqa = new Line2D(this.qa, this.qa.add(vt.getPerpendicular()));
			var lineqb = new Line2D(this.qb, this.qb.add(vt.getPerpendicular()));

			this.q1a = line1a.intersectLine(lineqa).pos;
			this.q2a = line2a.intersectLine(lineqa).pos;
			this.q1b = line1b.intersectLine(lineqb).pos;
			this.q2b = line2b.intersectLine(lineqb).pos;
		}
  }

  private createPoint(p: Vec2D, color: string) : fabric.Rect{
    const controlPointSize = 4
    return new fabric.Rect({
      left: p.x - controlPointSize / 2,
      top: p.y - controlPointSize / 2,
      width: controlPointSize,
      height: controlPointSize,
      fill: color,
      stroke: color,
      selectable: false,
      evented: false,
    })
  }

  private createDashedLine(p1: Vec2D, p2: Vec2D, color: string) : fabric.Line{
    return new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
      stroke: color,
      strokeWidth: 1,
      strokeDashArray: [2,4],
      selectable: false,
      evented: false,
    })
  }

  private createQuadraticPath(p1: Vec2D, c:Vec2D, p2: Vec2D,  color: string) : fabric.Path{
    return new fabric.Path(`M ${p1.x} ${p1.y} Q ${c.x}, ${c.y}, ${p2.x}, ${p2.y}`, {
      stroke: color,
      strokeWidth: 1,
      fill: '',
      selectable: false,
      evented: false,
    })
  }

  //control points - no split
  private capf?: fabric.Rect;
  private cbpf?: fabric.Rect;

  // control points - split
  private p1apf?: fabric.Rect;
  private q1apf?: fabric.Rect;
  private p2apf?: fabric.Rect;
  private q2apf?: fabric.Rect;
  private qapf?: fabric.Rect;

  private p1bpf?: fabric.Rect;
  private q1bpf?: fabric.Rect;
  private p2bpf?: fabric.Rect;
  private q2bpf?: fabric.Rect;
  private qbpf?: fabric.Rect;

  //dashed lines - no split
  private p1acalf?: fabric.Line;
  private cap2alf?: fabric.Line;

  private p1bcblf?: fabric.Line;
  private cbp2blf?: fabric.Line;

  // dashed lines - split
  private p1aq1alf?: fabric.Line;
  private q1aqalf?: fabric.Line;
  private qaq2alf?: fabric.Line;
  private q2ap2alf?: fabric.Line;

  private p1bq1blf?: fabric.Line;
  private q1bqblf?: fabric.Line;
  private qbq2blf?: fabric.Line;
  private q2bp2blf?: fabric.Line;
  
  //centralLine
  private centralLine?: fabric.Path;

  //offsetLineA
  private offsetLineA?: fabric.Path;
  private offsetLineAP1?: fabric.Path;
  private offsetLineAP2?: fabric.Path;

  //offsetLineB
  private offsetLineB?: fabric.Path;
  private offsetLineBP1?: fabric.Path;
  private offsetLineBP2?: fabric.Path;


  removeFromCanvas(canvas: fabric.Canvas) {
    if (this.capf) {canvas.remove(this.capf); this.capf = undefined}
    if (this.cbpf) {canvas.remove(this.cbpf); this.cbpf = undefined}

    if (this.p1apf) {canvas.remove(this.p1apf); this.p1apf=undefined}
    if (this.q1apf) {canvas.remove(this.q1apf); this.q1apf=undefined}
    if (this.p2apf) {canvas.remove(this.p2apf); this.p2apf=undefined}
    if (this.q2apf) {canvas.remove(this.q2apf); this.q2apf=undefined}
    if (this.qapf) {canvas.remove(this.qapf); this.qapf=undefined}

    if (this.p1bpf) {canvas.remove(this.p1bpf); this.p1bpf=undefined}
    if (this.q1bpf) {canvas.remove(this.q1bpf); this.q1bpf=undefined}
    if (this.p2bpf) {canvas.remove(this.p2bpf); this.p2bpf=undefined}
    if (this.q2bpf) {canvas.remove(this.q2bpf); this.q2bpf=undefined}
    if (this.qbpf) {canvas.remove(this.qbpf); this.qbpf=undefined}

    if (this.p1acalf) {canvas.remove(this.p1acalf); this.p1acalf=undefined}
    if (this.cap2alf) {canvas.remove(this.cap2alf); this.cap2alf=undefined}

    if (this.p1bcblf) {canvas.remove(this.p1bcblf); this.p1bcblf=undefined}
    if (this.cbp2blf) {canvas.remove(this.cbp2blf); this.cbp2blf=undefined}

    if (this.p1aq1alf) {canvas.remove(this.p1aq1alf); this.p1aq1alf=undefined}
    if (this.q1aqalf) {canvas.remove(this.q1aqalf); this.q1aqalf=undefined}
    if (this.qaq2alf) {canvas.remove(this.qaq2alf); this.qaq2alf=undefined}
    if (this.q2ap2alf) {canvas.remove(this.q2ap2alf); this.q2ap2alf=undefined}
    
    if (this.p1bq1blf) {canvas.remove(this.p1bq1blf); this.p1bq1blf=undefined}
    if (this.q1bqblf) {canvas.remove(this.q1bqblf); this.q1bqblf=undefined}
    if (this.qbq2blf) {canvas.remove(this.qbq2blf); this.qbq2blf=undefined}
    if (this.q2bp2blf) {canvas.remove(this.q2bp2blf); this.q2bp2blf=undefined}

    if (this.centralLine) {canvas.remove(this.centralLine); this.centralLine=undefined}

    if (this.offsetLineA) {canvas.remove(this.offsetLineA); this.offsetLineA=undefined}
    if (this.offsetLineAP1) {canvas.remove(this.offsetLineAP1); this.offsetLineAP1=undefined}
    if (this.offsetLineAP2) {canvas.remove(this.offsetLineAP2); this.offsetLineAP2=undefined}

    if (this.offsetLineB) {canvas.remove(this.offsetLineB); this.offsetLineB=undefined}
    if (this.offsetLineBP1) {canvas.remove(this.offsetLineBP1); this.offsetLineBP1=undefined}
    if (this.offsetLineBP2) {canvas.remove(this.offsetLineBP2); this.offsetLineBP2=undefined}
  }

  private drawExistingRepresentationToCanvas(canvas: fabric.Canvas) {
    if (this.capf) canvas.add(this.capf);
    if (this.cbpf) canvas.add(this.cbpf);

    if (this.p1apf) canvas.add(this.p1apf);
    if (this.q1apf) canvas.add(this.q1apf);
    if (this.p2apf) canvas.add(this.p2apf);
    if (this.q2apf) canvas.add(this.q2apf);
    if (this.qapf) canvas.add(this.qapf);

    if (this.p1bpf) canvas.add(this.p1bpf);
    if (this.q1bpf) canvas.add(this.q1bpf);
    if (this.p2bpf) canvas.add(this.p2bpf);
    if (this.q2bpf) canvas.add(this.q2bpf);
    if (this.qbpf) canvas.add(this.qbpf);

    if (this.p1acalf) canvas.add(this.p1acalf);
    if (this.cap2alf) canvas.add(this.cap2alf);

    if (this.p1bcblf) canvas.add(this.p1bcblf);
    if (this.cbp2blf) canvas.add(this.cbp2blf);

    if (this.p1aq1alf) canvas.add(this.p1aq1alf);
    if (this.q1aqalf) canvas.add(this.q1aqalf);
    if (this.qaq2alf) canvas.add(this.qaq2alf);
    if (this.q2ap2alf) canvas.add(this.q2ap2alf);

    if (this.p1bq1blf) canvas.add(this.p1bq1blf);
    if (this.q1bqblf) canvas.add(this.q1bqblf);
    if (this.qbq2blf) canvas.add(this.qbq2blf);
    if (this.q2bp2blf) canvas.add(this.q2bp2blf);

    if (this.centralLine) canvas.add(this.centralLine);

    if (this.offsetLineA) canvas.add(this.offsetLineA);
    if (this.offsetLineAP1) canvas.add(this.offsetLineAP1);
    if (this.offsetLineAP2) canvas.add(this.offsetLineAP2);

    if (this.offsetLineB) canvas.add(this.offsetLineB);
    if (this.offsetLineBP1) canvas.add(this.offsetLineBP1);
    if (this.offsetLineBP2) canvas.add(this.offsetLineBP2);
  }

  private createCanvasRepresentation(drawControlPoints: boolean) {
    if (drawControlPoints) {
      const controlPointsColor = '#0072bc';
      if (!this.split) {
        if (this.ca && this.cb) {
          this.capf = this.createPoint(this.ca, controlPointsColor);
          this.cbpf = this.createPoint(this.cb, controlPointsColor);
        }
      } else {
        if (this.p1a && this.p2a && this.q1a && this.q2a && this.qa) {
          this.p1apf = this.createPoint(this.p1a, controlPointsColor);
          this.q1apf = this.createPoint(this.q1a, controlPointsColor);
          this.p2apf = this.createPoint(this.p2a, controlPointsColor);
          this.q2apf = this.createPoint(this.q2a, controlPointsColor);
          this.qapf = this.createPoint(this.qa, controlPointsColor);
        }

        if (this.p1b && this.p2b && this.q1b && this.q2b && this.qb) {

          this.p1bpf = this.createPoint(this.p1b, controlPointsColor);
          this.q1bpf = this.createPoint(this.q1b, controlPointsColor);
          this.p2bpf = this.createPoint(this.p2b, controlPointsColor);
          this.q2bpf = this.createPoint(this.q2b, controlPointsColor);
          this.qbpf = this.createPoint(this.qb, controlPointsColor);
        }
      }
      
      const controlLinesColor = '#0072bc';
      // draw dashed lines
      if (!this.split) {
        if (this.p1a && this.p2a && this.ca) {
          this.p1acalf = this.createDashedLine(this.p1a, this.ca, controlLinesColor);
          this.cap2alf = this.createDashedLine(this.ca, this.p2a, controlLinesColor);
        }

        if (this.p1b && this.p2b && this.cb) {
          this.p1bcblf = this.createDashedLine(this.p1b, this.cb, controlLinesColor);
          this.cbp2blf = this.createDashedLine(this.cb, this.p2b, controlLinesColor);
        }
      }
      else {
        if (this.p1a && this.p2a && this.q1a && this.q2a && this.qa) {
          this.p1aq1alf = this.createDashedLine(this.p1a, this.q1a, controlLinesColor);
          this.q1aqalf = this.createDashedLine(this.q1a, this.qa, controlLinesColor);
          this.qaq2alf = this.createDashedLine(this.qa, this.q2a, controlLinesColor);
          this.q2ap2alf = this.createDashedLine(this.q2a, this.p2a, controlLinesColor);
        }

        if (this.p1b && this.p2b && this.q1b && this.q2b && this.qb) {
          this.p1bq1blf = this.createDashedLine(this.p1b, this.q1b, controlLinesColor);
          this.q1bqblf = this.createDashedLine(this.q1b, this.qb, controlLinesColor);
          this.qbq2blf = this.createDashedLine(this.qb, this.q2b, controlLinesColor);
          this.q2bp2blf = this.createDashedLine(this.q2b, this.p2b, controlLinesColor);
        }
      }
    }
    // central line
    const centralLineColor = '#959595';
    this.centralLine = this.createQuadraticPath(this.start, this.control, this.end, centralLineColor);

    
    const offsetLineColor = '#0072bc'
    // offset curve a
		if (!this.split) {
      if (this.p1a && this.ca && this.p2a) {
        this.offsetLineA = this.createQuadraticPath(this.p1a, this.ca, this.p2a, offsetLineColor)
      } 
		}
		else {
      if (this.p1a && this.q1a && this.qa && this.q2a && this.p2a) {
        this.offsetLineAP1 = this.createQuadraticPath(this.p1a, this.q1a, this.qa, offsetLineColor)
        this.offsetLineAP2 = this.createQuadraticPath(this.qa, this.q2a, this.p2a, offsetLineColor)
      }
		}

    // offset curve b
		if (!this.split) {
      if (this.p1b && this.cb && this.p2b) {
        this.offsetLineB = this.createQuadraticPath(this.p1b, this.cb, this.p2b, offsetLineColor)
      } 
		}
		else {
      if (this.p1b && this.q1b && this.qb && this.q2b && this.p2b) {
        this.offsetLineBP1 = this.createQuadraticPath(this.p1b, this.q1b, this.qb, offsetLineColor)
        this.offsetLineBP2 = this.createQuadraticPath(this.qb, this.q2b, this.p2b, offsetLineColor)
      }
		}
  }

  drawToCamvas(canvas: fabric.Canvas, drawControlPoints: boolean) {
    this.removeFromCanvas(canvas);
    this.createCanvasRepresentation(drawControlPoints);
    this.drawExistingRepresentationToCanvas(canvas);
  }
}

export interface OffsetSpline {
  segments: [SplineSegment],
  thickness: number,
}
import { fabric } from 'fabric';
import { Point2d } from "./Point2d";

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

  drawToCamvas(canvas: fabric.Canvas) {
    const externalCanvas = document.createElement('canvas');
    externalCanvas.width = 300;
    externalCanvas.height = 300;
    var ctx = externalCanvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, externalCanvas.width, externalCanvas.height);
    ctx.lineWidth = 1;

    const drawControlPoints = true;
    if (drawControlPoints) {
			// draw control points
			var r = 2;
			ctx.beginPath();
			if (!this.split) {
        if (!this.ca || !this.cb) {
          return;
        }
				ctx.rect(this.ca.x - r, this.ca.y - r, r * 2, r * 2);
				ctx.rect(this.cb.x - r, this.cb.y - r, r * 2, r * 2);
			}
			else {
        if (!this.p1a || !this.p2a || !this.q1a || !this.q2a || !this.qa) {
          return;
        }
				ctx.rect(this.p1a.x - r, this.p1a.y - r, r * 2, r * 2);
				ctx.rect(this.q1a.x - r, this.q1a.y - r, r * 2, r * 2);
				ctx.rect(this.p2a.x - r, this.p2a.y - r, r * 2, r * 2);
				ctx.rect(this.q2a.x - r, this.q2a.y - r, r * 2, r * 2);
				ctx.rect(this.qa.x - r, this.qa.y - r, r * 2, r * 2);

        if (!this.p1b || !this.p2b || !this.q1b || !this.q2b || !this.qb) {
          return;
        }
				ctx.rect(this.p1b.x - r, this.p1b.y - r, r * 2, r * 2);
				ctx.rect(this.q1b.x - r, this.q1b.y - r, r * 2, r * 2);
				ctx.rect(this.p2b.x - r, this.p2b.y - r, r * 2, r * 2);
				ctx.rect(this.q2b.x - r, this.q2b.y - r, r * 2, r * 2);
				ctx.rect(this.qb.x - r, this.qb.y - r, r * 2, r * 2);

				ctx.moveTo(this.qa.x, this.qa.y);
				ctx.lineTo(this.qb.x, this.qb.y);
			}
			ctx.closePath();
			ctx.strokeStyle = '#0072bc';
			ctx.stroke();
			ctx.fillStyle = '#0072bc';
			ctx.fill();

			// draw dashed lines
			ctx.beginPath();
			if (!this.split) {
        if (!this.p1a || !this.p2a || !this.ca) {
          return;
        }
				ctx.moveTo(this.p1a.x, this.p1a.y);
				ctx.lineTo(this.ca.x, this.ca.y);
				ctx.lineTo(this.p2a.x, this.p2a.y);

        if (!this.p1b || !this.p2b || !this.cb) {
          return;
        }

				ctx.moveTo(this.p1b.x, this.p1b.y);
				ctx.lineTo(this.cb.x, this.cb.y);
				ctx.lineTo(this.p2b.x, this.p2b.y);
			}
			else {
        if (!this.p1a || !this.p2a || !this.q1a || !this.q2a || !this.qa) {
          return;
        }
				ctx.moveTo(this.p1a.x, this.p1a.y);
				ctx.lineTo(this.q1a.x, this.q1a.y);
				ctx.lineTo(this.qa.x, this.qa.y);
				ctx.lineTo(this.q2a.x, this.q2a.y);
				ctx.lineTo(this.p2a.x, this.p2a.y);

        if (!this.p1b || !this.p2b || !this.q1b || !this.q2b || !this.qb) {
          return;
        }

				ctx.moveTo(this.p1b.x, this.p1b.y);
				ctx.lineTo(this.q1b.x, this.q1b.y);
				ctx.lineTo(this.qb.x, this.qb.y);
				ctx.lineTo(this.q2b.x, this.q2b.y);
				ctx.lineTo(this.p2b.x, this.p2b.y);
			}
			ctx.setLineDash([2,4]);
			ctx.stroke();
			ctx.closePath();
			ctx.setLineDash([]);
		}

		// central line
		ctx.beginPath();
		ctx.moveTo(this.start.x, this.start.y);
		ctx.quadraticCurveTo(this.control.x, this.control.y, this.end.x, this.end.y);
		ctx.strokeStyle = '#959595';
		ctx.stroke();

		// offset curve a
    if (!this.p1a) {
      return;
    }
		ctx.beginPath();
		ctx.moveTo(this.p1a.x, this.p1a.y);
		if (!this.split) {
      if (!this.ca || !this.p2a) {
        return;
      }
			ctx.quadraticCurveTo(this.ca.x, this.ca.y, this.p2a.x, this.p2a.y);
		}
		else {
      if (!this.q1a || !this.qa || !this.q2a || !this.p2a) {
        return;
      }
			ctx.quadraticCurveTo(this.q1a.x, this.q1a.y, this.qa.x, this.qa.y);
			ctx.quadraticCurveTo(this.q2a.x, this.q2a.y, this.p2a.x, this.p2a.y);
		}
		ctx.strokeStyle = '#0072bc';
		ctx.lineWidth = 2;
		ctx.stroke();

		// offset curve b
		ctx.beginPath();
    if (!this.p1b) {
      return;
    }
		ctx.moveTo(this.p1b.x, this.p1b.y);
		if (!this.split) {
      if (!this.cb || !this.p2b) {
        return;
      }
			ctx.quadraticCurveTo(this.cb.x, this.cb.y, this.p2b.x, this.p2b.y);
		}
		else {
      if (!this.q1b || !this.qb || !this.q2b || !this.p2b) {
        return;
      }
			ctx.quadraticCurveTo(this.q1b.x, this.q1b.y, this.qb.x, this.qb.y);
			ctx.quadraticCurveTo(this.q2b.x, this.q2b.y, this.p2b.x, this.p2b.y);
		}
		ctx.strokeStyle = '#0072bc';
		ctx.stroke();

    const imageUrl = externalCanvas.toDataURL();

    // Step 4: Create a Fabric.js Image object
    fabric.Image.fromURL(imageUrl, (img) => {
      // Step 5: Add the Fabric.js Image object to the Fabric.js canvas
      canvas.add(img);
      canvas.renderAll();
    });
  }
}

export interface OffsetSpline {
  segments: [SplineSegment],
  thickness: number,
}
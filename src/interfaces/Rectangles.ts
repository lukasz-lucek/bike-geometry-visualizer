export interface FixedRectangle {
    width: number;
}

export interface SemiFixedRectangle extends FixedRectangle {
    length: number;
}

export interface OffsetFixedRectangle extends FixedRectangle {
    leftOffset: number;
    rightOffset: number;
}
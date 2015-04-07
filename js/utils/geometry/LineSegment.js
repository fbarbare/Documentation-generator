define([
    'geometry/namespace',
    'Math'
], function(namespace, Math) {

    var tolerance = 1e-10;

    namespace.LineSegment = function(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        // Ax + By = C
        this.a = y2 - y1;
        this.b = x1 - x2;
        this.c = x1 * this.a + y1 * this.b;

        if (namespace.LineSegment.eq(this.a, 0) && namespace.LineSegment.eq(this.b, 0)) {
            throw new Error(
                'Cannot construct a LineSegment with two equal endpoints.');
        }
    };

    namespace.LineSegment.eq = function (a, b) {
        return (Math.abs(a - b) < tolerance);
    };
    namespace.LineSegment.gt = function (a, b) {
        return (a - b > -tolerance);
    };
    namespace.LineSegment.lt = function (a, b) {
        return namespace.LineSegment.gt(b, a);
    }

    namespace.LineSegment.prototype.intersect = function(that) {
        var d = (this.x1 - this.x2) * (that.y1 - that.y2) -
                (this.y1 - this.y2) * (that.x1 - that.x2);

        if (namespace.LineSegment.eq(d, 0)) {
            // The two lines are parallel or very close.
            return {
                x : NaN,
                y : NaN
            };
        }

        var t1  = this.x1 * this.y2 - this.y1 * this.x2,
            t2  = that.x1 * that.y2 - that.y1 * that.x2,
            x   = (t1 * (that.x1 - that.x2) - t2 * (this.x1 - this.x2)) / d,
            y   = (t1 * (that.y1 - that.y2) - t2 * (this.y1 - this.y2)) / d,
            in1 = (namespace.LineSegment.gt(x, Math.min(this.x1, this.x2)) && namespace.LineSegment.lt(x, Math.max(this.x1, this.x2)) &&
                   namespace.LineSegment.gt(y, Math.min(this.y1, this.y2)) && namespace.LineSegment.lt(y, Math.max(this.y1, this.y2))),
            in2 = (namespace.LineSegment.gt(x, Math.min(that.x1, that.x2)) && namespace.LineSegment.lt(x, Math.max(that.x1, that.x2)) &&
                   namespace.LineSegment.gt(y, Math.min(that.y1, that.y2)) && namespace.LineSegment.lt(y, Math.max(that.y1, that.y2)));

        return {
            x   : x,
            y   : y,
            in1 : in1,
            in2 : in2
        };
    };

    namespace.LineSegment.prototype.x = function(y) {
        // x = (C - By) / a;
        if (this.a) {
            return (this.c - this.b * y) / this.a;
        } else {
            // a == 0 -> horizontal line
            return NaN;
        }
    };

    namespace.LineSegment.prototype.y = function(x) {
        // y = (C - Ax) / b;
        if (this.b) {
            return (this.c - this.a * x) / this.b;
        } else {
            // b == 0 -> vertical line
            return NaN;
        }
    };

    namespace.LineSegment.prototype.length = function() {
        return Math.sqrt(
            (this.y2 - this.y1) * (this.y2 - this.y1) +
            (this.x2 - this.x1) * (this.x2 - this.x1));
    };

    namespace.LineSegment.prototype.offset = function(x, y) {
        return new geo.LineSegment(
            this.x1 + x, this.y1 + y,
            this.x2 + x, this.y2 + y);
    };

    return namespace.LineSegment;
});
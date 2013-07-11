//Why does it feel like I've done this 10 times?


function vDot(p, q) {
    return _.reduce(_.zip(p, q), function (memo, pq) {
        return memo + ( pq[0] * pq[1] );
    });
}

//also works as center of points
function vAv(vectors) {
    var sum = _.reduce(vectors, function (memo, vec) {
        return vAdd(memo, vec);
    }, [0, 0]);
    return vDiv(vectors.length, sum);
}

function vAdd(p, q) {
    var i, result = [];
    for (i = 0; i < q.length; i++) {
        result[i] = (q[i] + p[i]);
    }
    return result;
}

function vSum(vectors) {
    _.reduce(vectors, function (memo, vector) {
        vAdd(memo, vector);
    }, [0, 0]);
}

function vMin(p, q) {
    var i, result = [];
    for (i = 0; i < q.length; i++) {
        result[i] = (p[i] - q[i]);
    }
    return result;
}

function vDiv(x, p) {
    return _.map(p, function (k) {
        return k / x;
    });
}

function vMult(x, p) {
    return _.map(p, function (k) {
        return k * x;
    });
}

function unitVector(p, q) {
    var i, dist = distance(p, q), unitVect = [];
    for (i = 0; i < q.length; i++) {
        unitVect[i] = (q[i] - p[i]) / dist;
    }
    return unitVect;
}

function lineIntersection(p0, p1, p2, p3) {
    var s1_x, s1_y, s2_x, s2_y, s, t;
    var s1 = vMin(p1, p0),
        s2 = vMin(p3, p2);

    s1_x = s1[0];
    s1_y = s1[1];
    s2_x = s2[0];
    s2_y = s2[1];

    s = (-s1_y * (p0[0] - p2[0]) + s1_x * (p0[1] - p2[1] )) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0[1] - p2[1]) - s2_y * (p0[0] - p2[0])) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { // Collision detected
        var intX = p0[0] + (t * s1_x);
        var intY = p0[1] + (t * s1_y);
        return [intX, intY];
    }
    return null;
}

//Is point in polygon
function pip(corners, point, outsidePoint) {
    if (_.isUndefined(outsidePoint)) {
        outsidePoint = [-1, -1];
    }
    var segs = segments(corners);

    return _.reduce(segs, function(memo, seg){
        var intersection = lineIntersection(point, outsidePoint, seg[0], seg[1]);
        if(!_.isNull(intersection)){
            return !memo;
        } return memo;
    }, false);
}

function rotate(n, l) {
    return l.slice(n).concat(l.slice(0, n));
}

function segments(points) {
    return _(points).zip(rotate(1, points)).map(function (x) {
        var a = x[0], b = x[1];
        return [ a, b ];
    });
}
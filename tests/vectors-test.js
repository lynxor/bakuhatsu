test( "hello test", function() {
    ok( 1 == "1", "Passed!" );
});

test( "line intersection", function() {
    var intersection = lineIntersection([1,1], [1,3], [0,2], [2,2] );
    deepEqual(intersection, [1,2]);
});

test( "rotate", function() {
    var r = rotate(1, [ 1, 2, 3, 4 ] );
    deepEqual(r, [ 2,3,4,1] );
});

test( "segments", function() {

    var segs = segments( [ 1, 2, 3, 4 ] );
    deepEqual(segs, [ [1,2], [2,3], [3,4], [4,1] ] );

});

test("point in polygon", function(){
    equal(true, pip([ [0,2], [1,1], [2,2], [1,3] ], [1,2]));
    equal(false, pip([ [0,2], [1,1], [2,2], [1,3] ], [4,4]));
});
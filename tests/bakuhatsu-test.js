
test( "line intersection", function() {
    var killzones = [ [[0, 350], [400, 350], [400, 400], [0, 400]] ];

    equal(true, inKillZones([360,360], killzones));
    equal(false, inKillZones([1,2], killzones));

});


var kill_radius = 70,
    panic_radius = 250,
    speed = 9;

function inRadius(location, center, radius) {
    return radius > distance(location, center);
}

function inKillZones(location, killzones){
    return _.any(killzones, function(kz){
        return pip(kz, location);
    });
}

function distance(q, p) {
    var i, sum = 0;
    for (i = 0; i < q.length; i++) {
        sum += (Math.pow((q[i] - p[i]), 2));
    }
    return Math.sqrt(sum);
}

//bombs is a list of vectors where bombs should hit
function calcExplosion(rabbits, bombs) {
    _.each(bombs, function (bomb) {
        rabbits = _.filter(rabbits, function (rabbit) {
            return !(inRadius(rabbit, bomb, kill_radius));
        });
    });
    return rabbits;
}

function calcPanic(rabbits, bombs, killzones, dim) {
    return _.chain(rabbits).map(function (rabbit) {
        var bombsInRange = _.filter(bombs, function (b) {
            return inRadius(rabbit, b,panic_radius);
        });

        if (bombsInRange.length) {
            return rabbitPanic(rabbit, bombsInRange, killzones, dim);
        }
        return rabbit;
    }).filter(_.isArray).value();
}

//get the center of the sources and then the direction between the center and the rabbit
function rabbitPanic(rabbit, panicSources, killzones, dim) {

          var center = vAv(panicSources),
              direction = unitVector(center, rabbit);

    var newPos = vAdd(rabbit, vMult(speed, direction));
    //Prevent from running out of warzone
    if (_.every(newPos, function (k) {
        return k > 10 && k < (dim - 10);
    })) {
       return inKillZones(newPos, killzones)? null : newPos;
    } else {
        return rabbit;
    }
}

function randomRabbits(number, size) {
    var all = _.map(_.range(size), function (i) {
        return _.map(_.range(size), function (j) {
            return [i, j];
        });
    });
    return _.chain(all).flatten(all, true).shuffle().take(number).value();
}

function worldView(rabbits, size) {
    var worldView = [];
    for (var i = 0; i < size; i++) {
        worldView[i] = [];
        for (var j = 0; j < size; j++) {
            worldView[i][j] = 0;
        }
    }
    _.each(rabbits, function (rabbit) {
        worldView[rabbit[0]][rabbit[1]] = 1;
    });
    return worldView;
}

////testing
//(function(){
//    console.log(worldView( randomRabbits(20, 10), 10 ) );
//    console.log(randomRabbits(20, 10).length);
//
//    var rabbits = [ [1,1], [0,1], [2,1], [0,2], [0,0] , [5,5] ],
//        bombs = [ [0,0] ];
//
//    console.log( calcExplosion(rabbits, bombs) );
//
//})();



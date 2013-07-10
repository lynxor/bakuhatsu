var kill_radius = 70,
    panic_radius = 250,
    speed = 4;

function inRadius(location, center, radius){
    return radius > distance(location, center);
}

function distance(q, p){
    var i, sum = 0;
    for(i = 0; i < q.length; i++){
        sum += (Math.pow( (q[i] - p[i]), 2));
    }
    return Math.sqrt(sum);
}

//bombs is a list of vectors where bombs should hit
function calcExplosion(rabbits, bombs) {
    _.each(bombs, function(bomb){
        rabbits = _.filter(rabbits, function(rabbit){
            return !(inRadius( rabbit, bomb, kill_radius));
        });
    });
    return rabbits;
}

function calcPanic(rabbits, bomb, dim){
    return _.map(rabbits, function(rabbit){
        if(inRadius(rabbit, bomb, panic_radius)){
           return rabbitPanic(rabbit, bomb, dim);
        }
        return rabbit;
    });
}

function rabbitPanic(rabbit, panicSource, dim){
    var u = unitVector(panicSource, rabbit),
        newPos = vAdd(rabbit, vMult(speed, u));

    //Prevent from running out of warzone
    if( _.every(newPos, function(k){
        return k > 10 && k < (dim - 10);
    })){ return newPos; } else{
        return rabbit;
    }


}

function vAdd(p,q){
    var i, result = [];
    for(i = 0; i < q.length; i++){
        result[i] = (q[i] + p[i]);
    }
    return result;
}

function vMult(x, p){
    return _.map(p, function(k){return k*x;});
}

function unitVector(p,q){
    var i, dist = distance(p,q), unitVect = [];
    for(i = 0; i < q.length; i++){
        unitVect[i] = (q[i] - p[i]) / dist;
    }
    return unitVect;
}


function randomRabbits(number, size){
   var all = _.map( _.range(size), function(i) {
       return _.map( _.range(size), function(j){
            return [i, j];
       });
   });
   return _.chain(all).flatten(all, true).shuffle().take(number).value();
}

function worldView(rabbits, size){
    var worldView = [];
    for (var i = 0; i< size; i++){
        worldView[i] = [];
        for (var j = 0; j < size; j++){
            worldView[i][j] = 0;
        }
    }
    _.each(rabbits, function(rabbit){
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



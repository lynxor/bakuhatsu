//Why does it feel like I've done this 10 times?


function vDot(p,q){
    return _.reduce( _.zip(p,q), function(memo, pq){
         return memo + ( pq[0] * pq[1] );
    });
}

function vAv(vectors){
    var sum = _.reduce(vectors, function(memo, vec){
        return vAdd(memo, vec);
    });
    return vDiv(vectors.length, sum);
}

function vAdd(p,q){
    var i, result = [];
    for(i = 0; i < q.length; i++){
        result[i] = (q[i] + p[i]);
    }
    return result;
}

function vDiv(x, p){
    return _.map(p, function(k){return k/x;});
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

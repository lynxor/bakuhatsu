var canvas = document.getElementById("the_canvas"),
    context = canvas.getContext("2d"),
    unbind = _.identity;

$(function(){

    _.each(levels, function(level){
       $("#levels").append('<button id="play_' + level.number + '">'+ level.name + '</button></br>');

       $("#play_" + level.number).click(function(){
          unbind();
          playLevel(level);
       });
    });

    playLevel(levels[0]);
});



function playLevel(level) {


    var dim = 400,
        numRabbits = 5,
        grassImage, //the image
        explosionImage, //explosion image
        explodedImage,
        rabbitImage,
        lavaImage,
        expzone,
        darkZone,
        rabbits = level.rabbits,//randomRabbits(numRabbits, (dim - 70)),
        killzones = level.killzones,
        availableBombs = level.availableBombs,
        bombs = [],
        numPanics = 20,
        panics = [_.map(_.range(numPanics), function () {
            return [];
        })],
        panicInterval = 100,
        originalRabbits, //replays!!
        renderQueue = [],
        selectedbomb;


    //init images upfront so they don't flicker
    (function(){
        explosionImage = new Image();
        explosionImage.src = "img/explosion.png";

        expzone = new Image();
        expzone.src = "img/thefadedring.png";

        darkZone = new Image();
        darkZone.src = "img/thedarkring.png";

        explodedImage = new Image();
        explodedImage.src = "img/exploded.png";

        lavaImage = new Image();
        lavaImage.src = "img/lava.png";

        initRenderQueue();
        draw();
        updateControls();
        setTimeout(drawKillZones, 500);
        //drawKillZones();
        $("#title").html('<h1>'+level.name+'</h1>');
        bindHandlers();
        unbind = unbindHandlers;

    })();

    function initRenderQueue(){
        renderQueue = [drawWarZone, drawKillZones, drawRabbits];
    }

    function reset() {
        numRabbits = parseInt( $("#num_rabbits").val() );
        kill_radius = parseInt( $("#kill_radius").val() );
        availableBombs = parseInt( $("#num_bombs").val() );
        rabbits = randomRabbits(numRabbits, (dim - 70));
        panics = [_.map(_.range(numPanics), function () {
            return [];
        })];
        bombs = [];
        initRenderQueue();
        updateControls();
        $("start_button").hide();
        draw();
    }

    function bindHandlers(){
        $("#retry_button").click(retry);
        $("#reset_button").click(reset);
        $("#replay_button").click(replay);
        $("#start_button").click(start);

        $(canvas).mousedown(mousedown);
        $(canvas).mouseup(mouseup);

        Mousetrap.bind("up", upPressed);
        Mousetrap.bind("down", downPressed);


    }

    function unbindHandlers(){
        console.log("unbinding handlers...")
        $("#retry_button").unbind('click', retry);
        $("#reset_button").unbind('click', reset);
        $("#replay_button").unbind('click', replay);
        $("#start_button").unbind('click', start);

        $(canvas).unbind('mousedown', mousedown);
        $(canvas).unbind('mouseup', mouseup);
        console.log("done");

        Mousetrap.unbind("up", upPressed);
        Mousetrap.unbind("down", downPressed);

    }



    function retry(){
        rabbits = originalRabbits;
        _.each(bombs, function(b){
            b.countdown = b.timeout;
        });
        panics = [];
        bombs = [];
        initRenderQueue();
        $("#start_button").hide();

        draw();
    }


    function updateControls() {
        $("#dashboard").html("Bombs left to place: " + (availableBombs - bombs.length));
        if (bombs.length === availableBombs) {
            $("#start_button").show();
        }
    }

    function placeBomb(pos, timeout) {
        console.log("Placing bomb at " + pos);
        if (bombs.length < availableBombs) {
            var thebomb = {pos: pos, timeout: timeout, countdown: timeout};
            bombs.push(thebomb);
            selectedbomb = thebomb;
            updateControls();
            draw();
        }
    }

    function replay(){
        rabbits = originalRabbits;
        _.each(bombs, function(b){
            b.countdown = b.timeout;
        });
        panics = [];
        initRenderQueue();
        draw();
        start();
    }


    function start() {
        originalRabbits = rabbits;

       // if (bombs.length === availableBombs) {
            _.each(bombs, function (bomb) {
                countdown(bomb);
            });
            startPanic();
        //}

        function countdown(bomb) {
            setTimeout(function () {
                if (_.isUndefined(bomb.countdown)) {
                    bomb.countdown = bomb.timeout;
                }
                bomb.countdown -= 1;
                //console.log("Time left: " + bomb.countdown);
                drawBomb(bomb);
                if (bomb.countdown <= 0) {
                    console.log("Exploding! " + bomb.pos);
                    explode(bomb.pos);
                    if (done()) {
                        setTimeout(function(){
                            renderQueue.push(showResult);
                            draw();
                        }, 1000);
                        $("#replay_button").show();
                    }
                } else {
                    countdown(bomb);
                }
            }, 1000);
        }
    }

    function showResult() {
        context.font = "bold 30px sans-serif";
        context.textBaseline = "center";
        context.textAlign = "center";
        $("#replay_button").show();
        if (rabbits.length) {
            $("#result").html("You suck!");
            context.fillStyle = "#F00";
            context.fillText("You suck!", dim/2, dim/2);
        } else {
            context.fillStyle = "#F00";
            context.fillText("Well done, eradication!!", dim/2, dim/2);
        }
    }

    function done() {
        return !_.any(bombs, function (bomb) {
            return bomb.countdown > 0;
        }) && bombs.length !== 0 && panics.length === 0;
    }

    function explode(pos) {
        rabbits = calcExplosion(rabbits, [pos]);
        drawExplosion(pos);
        setTimeout(draw, 200);
        panic(pos);
    }

    function panic(pos) {
        var thisPanics = _.map(_.range(numPanics), function () {
            return pos
        });

        for (var i = 0; i < thisPanics.length; i++) {
            if (_.isUndefined(panics[i])) {
                panics[i] = [thisPanics[i]];
            } else {
                panics[i].push(thisPanics[i]);
            }
        }
    }

    function startPanic() {

        function doPanic() {
            if (panics.length) {
                var pbombs = panics.pop();
                rabbits = calcPanic(rabbits, pbombs, killzones, dim);
                draw();
            }
            if (!done() || panics.length) {
                setTimeout(doPanic, panicInterval);
            } else {
                renderQueue.push(showResult);
                draw();
            }

        }
        doPanic();
    }

//    $(canvas).mousemove(function (e) {
//        if (!done()) {
//            var pos = position(e),x = pos.x, y = pos.y;
//            draw();
//            if(x > 3 && x < (dim - 3) && y  > 3 && y < (dim - 3)){     //blagh useless
//                //showExplosionZone([x, y]);
//            }
//        }
//    });



    function upPressed(e){

        if(selectedbomb){
            selectedbomb.timeout = (selectedbomb.timeout % 10) + 1;
            selectedbomb.countdown = selectedbomb.timeout;
            draw();
        }
    }
    function downPressed(e){

        if(selectedbomb){
            if(selectedbomb.timeout == 1){
                selectedbomb.timeout = 11;
            }
            selectedbomb.timeout = selectedbomb.timeout - 1;
            selectedbomb.countdown = selectedbomb.timeout;
            draw();
        }
    }

    function mousedown(e){
        var pos = position(e),x = pos.x, y = pos.y;
        selectedbomb = _.find(bombs, function(b){
            return distance(b.pos, [x,y]) < 10; //bit inaccurate but should do the trick
        });
    }

    function mouseup(e){
        var pos = position(e),x = pos.x, y = pos.y;

        if(selectedbomb){
            selectedbomb.pos = [x,y];
            draw();
        } else {
            placeBomb([x,y], 1);
        }
    }

    function position(e){
        var position = $(canvas).position(),
            x = e.pageX - position.left,
            y = e.pageY - position.top;
        return {x: x, y: y};
    }

//    $(canvas).click(function (e) {
//        var pos = position(e),x = pos.x, y = pos.y;
//
//    });

    function showExplosionZone(pos) {

        context.drawImage(expzone, pos[0] - panic_radius, pos[1] - panic_radius, panic_radius * 2, panic_radius * 2);
        context.drawImage(darkZone, pos[0] - kill_radius, pos[1] - kill_radius, kill_radius * 2, kill_radius * 2);
    }

    function draw() {
        _.each(renderQueue, function(f){f();});
    }

    function drawExplosion(pos) {
//        context.fillStyle = "#F62";
//        fillCircle(pos[0], pos[1], kill_radius);
        var radius = kill_radius
        context.drawImage(explosionImage, pos[0] - radius, pos[1] - radius, kill_radius * 2, kill_radius * 2);
    }

    function fillCircle(centerX, centerY, radius) {
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fill();
    }

    function  strokeCircle(centerX, centerY, radius){
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.stroke();
    }

    function drawWarZone() {
//        context.fillStyle = "#3F3";
//        context.fillRect(0, 0, dim, dim);
        var blockSize = 100;
        if(_.isUndefined(grassImage)){
            grassImage = new Image();
            grassImage.src = "img/grass.png";
            grassImage.onload = drawGrass;
        }

        function drawGrass(){
            for(var i = 0; i < dim/blockSize; i++){
                for(var j = 0; j < dim/blockSize; j++){
                    context.drawImage(grassImage, j*blockSize, i*blockSize, blockSize, blockSize);
                }
            }
        }
        drawGrass();
        _.each(bombs, drawBomb);
    }

    function drawPolygon(points){
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        _.each(_.rest(points), function(p){
            context.lineTo(p[0],p[1]);
        });
        context.closePath();
        context.fill();
    }


    function drawKillZones(){
        var pattern = context.createPattern(lavaImage, "repeat");
        context.fillStyle = pattern;
        _.each(killzones, drawPolygon);
    }

    function drawRabbits() {
        if(!rabbitImage){
            rabbitImage = new Image();
            rabbitImage.src = "img/rabbited.png";
            rabbitImage.onload = onloadStuff;
        }

        function onloadStuff() {
            for (var i = 0; i < rabbits.length; i++) {
                var r = rabbits[i];
                //console.log("Drawing " + r);
                context.drawImage(rabbitImage, r[0] - 10, r[1] - 10, 20, 20);
            }
        }
        onloadStuff();
    }

    function drawBomb(bomb) {
        var x = bomb.pos[0], y = bomb.pos[1];

        if (_.isUndefined(bomb.countdown)) bomb.countdown = bomb.timeout;

        if (bomb.countdown > 0) {
            context.fillStyle = '#F00';
            context.fillRect(x - 20, y - 10, 40, 20);

            context.fillStyle = "#FFF";
            context.font = "bold 12px sans-serif";
            context.textBaseline = "top";
            context.fillText("" + bomb.countdown, x - 1, y - 6);
            if(bomb == selectedbomb){
                context.strokeStyle = '#D11';
                strokeCircle(x, y, kill_radius);
            }
           // strokeCircle(x, y, panic_radius);
        } else {
            var radius = kill_radius;
            context.drawImage(explodedImage, x - radius, y - radius, kill_radius * 2, kill_radius * 2);
        }
    }

}


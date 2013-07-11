$(function () {

    var canvas = document.getElementById("the_canvas"),
        context = canvas.getContext("2d"),
        dim = 400,
        numRabbits = 5,
        grassImage, //the image
        explosionImage, //explosion image
        explodedImage,
        rabbitImage,
        lavaImage,
        expzone,
        darkZone,
        rabbits = randomRabbits(numRabbits, dim - 20),
        killzones = [ [[0, 350], [400, 350], [400, 400], [0, 400]] ], //wtf
        availableBombs = 3,
        bombs = [],
        numPanics = 20,
        panics = [_.map(_.range(numPanics), function () {
            return [];
        })],
        panicInterval = 100,
        originalRabbits, //replays!!
        renderQueue = [];


    //init images
    (function(){
        explosionImage = new Image();
        explosionImage.src = "img/explosion.png";
       // explosionImage.onload = function(){ context.drawImage(explosionImage, 0,0);}

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

    })();

    function initRenderQueue(){
        renderQueue = [drawWarZone, drawKillZones, drawRabbits];
    }

    function reset() {
        numRabbits = parseInt( $("#num_rabbits").val() );
        kill_radius = parseInt( $("#kill_radius").val() );
        availableBombs = parseInt( $("#num_bombs").val() );
        rabbits = randomRabbits(numRabbits, dim - 20);
        panics = [_.map(_.range(numPanics), function () {
            return [];
        })];
        bombs = [];
        initRenderQueue();
        updateControls();
        $("start_button").hide();

        draw();

    }

    $("#retry_button").click(retry);

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

    $("#reset_bombs_button").click(function(){
        bombs = [];
        $("start_button").hide();
        availableBombs = parseInt( $("#num_bombs").val() );
        initRenderQueue();
        draw();
    });



    $("#reset_button").click(reset);

    function updateControls() {
        $("#dashboard").html("Bombs left to place: " + (availableBombs - bombs.length));
        if (bombs.length === availableBombs) {
            $("#start_button").show();
        }
    }

    function placeBomb(pos, timeout) {
        if (bombs.length < availableBombs) {
            var thebomb = {pos: pos, timeout: timeout, countdown: timeout};
            bombs.push(thebomb);

            updateControls();
            drawBomb(thebomb);
        }
    }

    $("#replay_button").click(replay);
    function replay(){
        rabbits = originalRabbits;
        _.each(bombs, function(b){
            b.countdown = b.timeout;
        });
        panics = [];
        draw();
        start();
    }

    $("#start_button").click(start);
    function start() {
        originalRabbits = rabbits;

        if (bombs.length === availableBombs) {
            _.each(bombs, function (bomb) {
                countdown(bomb);
            });
            startPanic();
        }

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
            }
        }
        doPanic();
    }

    $(canvas).mousemove(function (e) {
        if (!done()) {
            var position = $(canvas).position(),
                x = e.pageX - position.left,
                y = e.pageY - position.top;
            draw();
            if(x > 3 && x < (dim - 3) && y  > 3 && y < (dim - 3)){     //blagh useless
                showExplosionZone([x, y]);
            }
        }
    });


    $(canvas).mousedown(function (e) {
        var position = $(canvas).position(),
            x = e.pageX - position.left,
            y = e.pageY - position.top;

        placeBomb([x, y], parseInt($("#timer").val()));
    });

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

            context.strokeStyle = '#D11';
            strokeCircle(x, y, kill_radius);
           // strokeCircle(x, y, panic_radius);
        } else {
            var radius = kill_radius;
            context.drawImage(explodedImage, x - radius, y - radius, kill_radius * 2, kill_radius * 2);
        }
    }

});

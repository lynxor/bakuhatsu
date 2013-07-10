$(function () {

    var canvas = document.getElementById("the_canvas"),
        context = canvas.getContext("2d"),
        dim = 400,
        numRabbits = 20,
        rabbits = randomRabbits(numRabbits, dim - 20),
        availableBombs = 4,
        bombs = [],
        numPanics = 20,
        panics = [_.map(_.range(numPanics),function(){return [];})],
        panicInterval = 100;

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

    $("#start_button").click(start);
    function start() {
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
                console.log("Time left: " + bomb.countdown);
                drawBomb(bomb);
                if (bomb.countdown <= 0) {
                    console.log("EXploding! " + bomb.pos);
                    explode(bomb.pos);

                    if(done()){
                         showResult();
                    }
                } else {
                    countdown(bomb);
                }
            }, 1000);
        }
    }

    function showResult(){
        if(rabbits.length){
            $("#result").html("You suck!");
        } else{
            $("#result").html("Well done, all rabbits are now eradicated!");
        }
    }

    function done(){
        return !_.any(bombs, function(bomb){
            return bomb.countdown > 0;
        });
    }

    function explode(pos) {
        rabbits = calcExplosion(rabbits, [pos]);
        drawExplosion(pos);
        setTimeout(draw, 200);
        setTimeout(function(){panic(pos);}, 200);
    }

    function panic(pos){
        var thisPanics = _.map(_.range(numPanics), function(){return pos});

        for(var i = 0; i< thisPanics.length; i++){
          if(_.isUndefined(panics[i])){
              panics[i] = [thisPanics[i]];
          } else{
              panics[i].push(thisPanics[i]);
          }
        }


    }

    function startPanic(){

        function doPanic(){
            if(panics.length ){
                var pbombs = panics.pop();
                rabbits = calcPanic(rabbits, pbombs, dim);
                draw();
            }
            if(!done()){
                setTimeout(doPanic, panicInterval);
            }
        }
        doPanic();
    }

    $(canvas).mousedown(function (e) {
        var position = $(canvas).position(),
            x = e.pageX - position.left,
            y = e.pageY - position.top;

        placeBomb([x, y], parseInt( $("#timer").val() ));
    });

    function draw() {
        drawWarZone();
        drawRabbits();
    }

    function drawExplosion(pos) {
        context.fillStyle = "#F62";
        circle(pos[0], pos[1], kill_radius);
    }

    function circle(centerX, centerY, radius) {
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fill();
    }

    function drawWarZone() {
        context.fillStyle = "#3F3";
        context.fillRect(0, 0, dim, dim);
        _.each(bombs, drawBomb);
    }

    function drawRabbits() {
        var rabbit = new Image();
        rabbit.src = "img/rabbit.jpg";
        rabbit.onload = function () {
            for (var i = 0; i < rabbits.length; i++) {
                var r = rabbits[i];
                //console.log("Drawing " + r);
                context.drawImage(rabbit, r[0], r[1], 20, 20);
            }
        }
    }

    function drawBomb(bomb) {
        var x = bomb.pos[0], y = bomb.pos[1];

        if (_.isUndefined(bomb.countdown)) bomb.countdown = bomb.timeout;

        if (bomb.countdown > 0) {
            context.fillStyle = '#F00';
            context.fillRect(x, y, 40, 20);

            context.fillStyle = "#FFF";
            context.font = "bold 12px sans-serif";
            context.textBaseline = "top";
            context.fillText("" + bomb.countdown, x + 15, y);
        }

    }

    draw();
    updateControls();

});

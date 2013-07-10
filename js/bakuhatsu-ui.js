$(function () {

    var canvas = document.getElementById("the_canvas"),
        context = canvas.getContext("2d"),
        dim = 400,
        numRabbits = 20,
        rabbits = randomRabbits(numRabbits, dim - 20),
        availableBombs = 3,
        bombs = [];

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
        }

        function countdown(bomb) {
            setTimeout(function () {
                if (_.isUndefined(bomb.countdown)) {
                    bomb.countdown = bomb.timeout;
                }
                bomb.countdown -= 1;
                console.log("Time left: " + bomb.countdown);
                if (bomb.countdown <= 0) {
                    console.log("EXploding! " + bomb.pos);
                    explode(bomb.pos);
                    panic(bomb.pos);
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
            $("#result").html("Well done, all rabbits are now erradicated!");
        }
    }

    function done(){
        return !_.any(bombs, function(bomb){
            return bomb.countdown > 0;
        });
    }

    function explode(bomb) {
        rabbits = calcExplosion(rabbits, [bomb]);
        drawExplosion(bomb);
        setTimeout(draw, 200);
    }

    function panic(pos){

    }

    $(canvas).mousedown(function (e) {
        var position = $(canvas).position(),
            x = e.pageX - position.left,
            y = e.pageY - position.top;

        placeBomb([x, y], parseInt((Math.random() * 10 )));
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
            context.strokeStyle = '#F00';
            context.strokeRect(x, y, 40, 20);

        }

    }

    draw();
    updateControls();

});

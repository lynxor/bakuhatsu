var levels = [
    {
        number: 1,
        name: "Level 1",
        tip: "Just blow them up!",
        killzones : [  ],
        rabbits : [ [135, 200], [265, 200]],
        availableBombs : 1
    },
    {
        number: 2,
        name: "Level 2",
        tip: "Chase them into the lava!!",
        killzones : [ [[0, 350], [400, 350], [400, 400], [0, 400]] ],
        rabbits : [ [150, 300], [225, 300], [300, 300]],
        availableBombs : 1
    },
    {
        number: 3,
        name: "Level 3",
        killzones : [ [[100, 150], [300, 150], [300, 250], [100, 250]] ],
        rabbits : [ [150, 50], [320, 270], [390, 390] ],
        availableBombs : 2
    },
    {
        number: 4,
        name: "Level 4",
        killzones : [
            [ [100, 350], [200, 350], [200, 380], [100, 380] ],
            [ [100, 100], [200, 100], [200,200], [150, 250], [100, 200] ]
        ],
        rabbits : [ [200, 270], [250, 50], [350, 300] ],
        availableBombs : 2
    },
    {
        number: 5,
        name: "Random Level",
        killzones : [],
        rabbits : randomRabbits(30, 400),
        availableBombs: 10
    },
    {
        number: 6,
        name: "Level 6",
        killzones : [
            [ [0, 100], [150, 50], [250, 50], [400, 100], [400, 150], [250, 100], [150, 100], [0, 150] ],
            [ [50, 100], [100, 100], [100,200], [150, 250], [50, 200] ],
            [ [360, 350], [320, 350], [320, 380], [360, 380] ],
        ],
        rabbits : [ [250, 140], [200, 140], [200, 270], [250, 285], [340, 300] ],
        availableBombs : 1
    }
];
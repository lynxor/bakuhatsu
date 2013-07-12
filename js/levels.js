var levels = [
    {
        number: 1,
        name: "Level 1",
        killzones : [ [[0, 350], [400, 350], [400, 400], [0, 400]] ],
        rabbits : [ [150, 300], [225, 300], [300, 300]],
        availableBombs : 1
    },
    {
        number: 2,
        name: "Level 2",
        killzones : [ [[100, 150], [300, 150], [300, 250], [100, 250]] ],
        rabbits : [ [150, 100], [150, 350], [350, 350] ],
        availableBombs : 2
    },
    {
        number: 3,
        name: "Level 3",
        killzones : [
            [ [0, 350], [400, 350], [400, 400], [0, 400] ],
            [ [100, 100], [200, 100], [200,200], [150, 250], [100, 200] ]
        ],
        rabbits : [ [200, 270], [250, 50], [350, 300] ],
        availableBombs : 2
    },
    {
        number: 4,
        name: "Random Level",
        killzones : [],
        rabbits : randomRabbits(30, 400),
        availableBombs: 10
    }
];
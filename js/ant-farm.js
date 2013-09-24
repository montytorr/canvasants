var AntApp = AntApp || {};

AntApp.AntFarm = function(options) {

    var NEST_SIZE = 30; //pixels, side of square

    var ants = [];
    var paperLib = null;
    var worldHeight = null;
    var worldWidth = null;
    var totalAnts = null;
    var pheromoneMatrix = false;
    var piecesOfFood = null;

    var init = function(options) {

        paperLib = options.paperLib;
        worldHeight = options.canvas.clientHeight;
        worldWidth = options.canvas.clientWidth;
        totalAnts = options.ants;

        createPheromoneMatrix();
        createNestView();
        createAnts();
        createFood();
        paperLib.view.draw();
    };

    var createPheromoneMatrix = function() {

        pheromoneMatrix = new AntApp.PheromoneMatrix({

            paperLib:       paperLib,
            worldWidth:     worldWidth,
            worldHeight:    worldHeight
        });
    };

    var createNestView = function() {

        var nestStaringPoint = new paperLib.Point((worldWidth/2), (worldHeight/2));
        var nestShape = new paperLib.Path.Circle(nestStaringPoint, NEST_SIZE/2);
        nestShape.style = {
            fillColor: "#aaa"
        };
    };

    var setPixel = function (imageData, x, y, r, g, b, a) {

        index = (x + y * imageData.width) * 4;
        imageData.data[index+0] = r;
        imageData.data[index+1] = g;
        imageData.data[index+2] = b;
        imageData.data[index+3] = a;
    };

    var createAnts = function() {

        var randomX, randomY;
        for(var i=0; i<totalAnts; i++) {

            randomX = Math.floor(Math.random()*NEST_SIZE*2) + (worldWidth/2) - (NEST_SIZE);
            randomY = Math.floor(Math.random()*NEST_SIZE*2) + (worldHeight/2) - (NEST_SIZE);

            ants.push( new AntApp.Ant({
                    id:       i,
                    initialX: randomX,
                    initialY: randomY,
                    paperLib: paperLib,
                    antFarm: instance
                })
            );
        }

    };

    var createFood = function() {

        piecesOfFood = piecesOfFood || [];

        piecesOfFood.push(new AntApp.Food({
            x: 50,
            y: 50,
            totalFood: 5000,
            width: 50,
            height: 20,
            paperLib: paperLib,
            antFarm: instance
        }));
    };

    var getFarmLimits = function() {

        return {
            width: worldWidth,
            height: worldHeight
        };
    };

    var updateFarm = function(event) {

        _.each(ants, function(ant) {

            ant.update(event);
        });

        pheromoneMatrix.update(event, ants);
    };

    var instance = {

        updateFarm:     updateFarm,
        getFarmLimits:  getFarmLimits
    };

    init(options);


    return instance;
};
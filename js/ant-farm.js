var AntApp = AntApp || {};

AntApp.AntFarm = function(options) {

    var PHEROMONE_ANT_SECOND = 3;
    var PHEROMONE_DECAY_SECOND = 0.05;
    var PHEROMONE_MAX = 5;

    var ants = [];
    var paperLib = null;
    var worldHeight = null;
    var worldWidth = null;
    var totalAnts = null;
    var pheromoneMatrix = [];
    var pheromoneView = null;
    var pheromoneViewData = null;

    var init = function(options) {

        paperLib = options.paperLib;
        worldHeight = options.canvas.clientHeight;
        worldWidth = options.canvas.clientWidth;
        totalAnts = options.ants;

        createPheromoneView();
        createAnts();
        paperLib.view.draw();
    };

    var createPheromoneView = function() {

        var emptyRectangle = new paperLib.Path.Rectangle(0,0,worldWidth,worldHeight);
        emptyRectangle.style = {
            fillColor: 'white'
        };
        pheromoneView = emptyRectangle.rasterize();
        pheromoneViewData = pheromoneView.getImageData(emptyRectangle);
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

            randomX = Math.floor(Math.random()*worldWidth);
            randomY = Math.floor(Math.random()*worldHeight);

            ants.push( new AntApp.Ant({
                    id:       i,
                    initialX: randomX,
                    initialY: randomY,
                    paperLib: paperLib
                })
            );
        }

    };

    var updateFarm = function(event) {

        _.each(ants, function(ant) {

            ant.updatePosition(event);
        });

        updatePheromoneMatrix(event);

        updatePheromoneView();
    };

    var updatePheromoneMatrix = function(event) {

        _.each(ants, function(ant) {

            var x = Math.round(ant.x);
            var y = Math.round(ant.y);
            pheromoneMatrix[x] = pheromoneMatrix[x] || [];
            pheromoneMatrix[x][y] = pheromoneMatrix[x][y] || 0;
            pheromoneMatrix[x][y] += event.delta*PHEROMONE_ANT_SECOND;
        });

        var decayToApply = event.delta*PHEROMONE_DECAY_SECOND;
        for(var i=0; i<worldWidth; i++) {

            if(pheromoneMatrix[i]) {

                for(var j=0; j<worldHeight; j++) {

                    if(pheromoneMatrix[i][j]) {

                        pheromoneMatrix[i][j] -= decayToApply;
                        if(pheromoneMatrix[i][j] < 0) {
                            pheromoneMatrix[i][j] = 0;
                        } else if (pheromoneMatrix[i][j] > PHEROMONE_MAX) {
                            pheromoneMatrix[i][j] = PHEROMONE_MAX;
                        }
                    }
                }
            }
        }
    };

    var updatePheromoneView = function() {

        for(var i=0; i<worldWidth; i++) {

            if(pheromoneMatrix[i]) {

                for(var j=0; j<worldHeight; j++) {

                    if(pheromoneMatrix[i][j]) {

                        var alpha = Math.round((pheromoneMatrix[i][j] / PHEROMONE_MAX)*256) | 0;
                        setPixel(pheromoneViewData, i, j, 255 , 0, 0, alpha); //255
                    }
                }
            }
        }

        pheromoneView.setImageData(pheromoneViewData);
    };

    init(options);

    return {

        updateFarm:     updateFarm
    };
};
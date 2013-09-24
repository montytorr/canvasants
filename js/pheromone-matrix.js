var AntApp = AntApp || {};

AntApp.PheromoneMatrix = function(options) {

    var PHEROMONE_ANT_SECOND = 0;
    var PHEROMONE_ANT_WITH_FOOD_SECOND = 1;
    var PHEROMONE_DECAY_SECOND = 0.01;
    var PHEROMONE_MAX = 2;

    var paperLib = null;
    var pheromoneView = null;
    var pheromoneViewData = null;
    var pheromoneMatrix = [];

    var worldWidth = false;
    var worldHeight = false;

    var init = function(options) {

        worldWidth = options.worldWidth;
        worldHeight = options.worldHeight;
        paperLib = options.paperLib;

        initView();
    };

    var initView = function() {

        var emptyRectangle = new paperLib.Path.Rectangle(0,0,worldWidth,worldHeight);
        emptyRectangle.style = {
            fillColor: 'white'
        };
        pheromoneView = emptyRectangle.rasterize();
        pheromoneViewData = pheromoneView.getImageData(emptyRectangle);
    };

    var update = function(event, ants) {

        updatePheromoneMatrix(event, ants);
        updatePheromoneView();
    };


    var updatePheromoneMatrix = function(event, ants) {

        _.each(ants, function(ant) {

            var x = Math.round(ant.x);
            var y = Math.round(ant.y);
            pheromoneMatrix[x] = pheromoneMatrix[x] || [];
            pheromoneMatrix[x][y] = pheromoneMatrix[x][y] || 0;
            if(ant.hasFood()) {

                pheromoneMatrix[x][y] += event.delta*PHEROMONE_ANT_WITH_FOOD_SECOND;
            } else {

                pheromoneMatrix[x][y] += event.delta*PHEROMONE_ANT_SECOND;
            }
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

        update:     update
    };
};








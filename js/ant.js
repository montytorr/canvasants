/*
Not carrying food, not on pheromone trail -> walk randomly lay pheromone
Not carrying food on pheromone trail -> follow pheromone trail lay more pheromone
Reach home without food on pheromone trail -> turn around follow trail in opposite direction
Reach food -> pick up food turn around follow trail in opposite direction
Carrying food -> follow trail lay more pheromone
Reach home with food -> deposit food turn around follow trail in opposite direction

http://mute-net.sourceforge.net/howAnts.shtml

 */

var AntApp = AntApp || {};

AntApp.Ant = function(options) {

    this._init(options);
};

AntApp.Ant.prototype = {

    COLOR: "#000",
    STROKE_WIDTH: 1,
    MAX_SPEED: 5, //Pixels per second
    MAX_ROTATION: 2, //Radians per second

    paperLib: null,
    antShape: null,
    antFarm: null,

    id: null,
    x: null,
    y: null,
    rotation: null,
    prevRotation: null,

    _init: function(options) {

        this.id = options.id;
        this.x = options.initialX;
        this.y = options.initialY;
        this.prevRotation = 0;
        this.rotation = 2*Math.random()*Math.PI;
        this.paperLib = options.paperLib;
        this.antFarm = options.antFarm;
        this.food = 0;

        this._initView();
    },

    _initView: function() {

        var initPosition = new this.paperLib.Point(0, 0);
        this.antShape = new this.paperLib.Path(initPosition, 1);
        this.antShape.lineTo(new this.paperLib.Point(0, 4));
        this.antShape.style = {
            fillColor: this.COLOR,
            strokeColor: this.COLOR,
            strokeWidth: this.STROKE_WIDTH
        };

        this._position();
    },

    _position: function() {

        var newLocation = new this.paperLib.Point(this.x, this.y);
        this.antShape.position = newLocation;
        var rotationDelta = (this.rotation - this.prevRotation) * 57.2957795;
        this.antShape.rotate (rotationDelta);
        this.prevRotation = this.rotation;
    },

    update: function(event) {

        var deltaRotation = ((2*Math.random()*this.MAX_ROTATION ) - this.MAX_ROTATION )* (event.delta);
        this._addToRotation(deltaRotation);

        this.x += Math.sin(this.rotation) * (this.MAX_SPEED*event.delta);
        this.y += -Math.cos(this.rotation) * (this.MAX_SPEED*event.delta);

        var limits = this.antFarm.getFarmLimits();
        if(this._isOutOfLimits(limits)){

            this._setInsideLimits(limits);
        }

        this._position();

        //If it has food and it's in the nest, drop it
        if(this.hasFood() && this.isInNest() ) {

            this.dropFood();
        }

        //If it finds food: turn around
    },

    _isOutOfLimits: function(limits) {

        return (this.x <0) || (this.y<0) || (this.x>limits.width) || (this.y>limits.height);
    },

    _setInsideLimits: function(limits) {

        //Circular world!!
        if(this.x <0) {

            this.x += limits.width;
        }
        if(this.x >limits.width) {

            this.x -= limits.width;
        }
        if(this.y <0) {

            this.y += limits.height;
        }
        if(this.y >limits.height) {

            this.y -= limits.height;
        }
    },

    _addToRotation: function(deltaRotation) {

        this.rotation += deltaRotation;
        if(this.rotation <0) {

            this.rotation += 2*Math.PI;
        } else if(this.rotation < 2*Math.PI) {

            this.rotation -= 2*Math.PI;
        }
    },

    hasFood: function() {

        return !!this.food;
    }
};
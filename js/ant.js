var AntApp = AntApp || {};

AntApp.Ant = function(options) {

    this.init(options);
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

    init: function(options) {

        this.id = options.id;
        this.x = options.initialX;
        this.y = options.initialY;
        this.prevRotation = 0;
        this.rotation = 2*Math.random()*Math.PI;
        this.paperLib = options.paperLib;
        this.antFarm = options.antFarm;
        this.food = 0;

        this.initView();
    },

    initView: function() {

        var initPosition = new this.paperLib.Point(0, 0);
        this.antShape = new this.paperLib.Path(initPosition, 1);
        this.antShape.lineTo(new this.paperLib.Point(0, 4));
        this.antShape.style = {
            fillColor: this.COLOR,
            strokeColor: this.COLOR,
            strokeWidth: this.STROKE_WIDTH
        };

        this.position();
    },

    position: function() {

        var newLocation = new this.paperLib.Point(this.x, this.y);
        this.antShape.position = newLocation;
        var rotationDelta = (this.rotation - this.prevRotation) * 57.2957795;
        this.antShape.rotate (rotationDelta);
        this.prevRotation = this.rotation;
    },

    updatePosition: function(event) {

        var deltaRotation = ((2*Math.random()*this.MAX_ROTATION ) - this.MAX_ROTATION )* (event.delta);
        this.addToRotation(deltaRotation);

        this.x += Math.sin(this.rotation) * (this.MAX_SPEED*event.delta);
        this.y += -Math.cos(this.rotation) * (this.MAX_SPEED*event.delta);

        var limits = this.antFarm.getFarmLimits();
        if(this.isOutOfLimits(limits)){

            this.setInsideLimits(limits);
        }

        this.position();
    },

    isOutOfLimits: function(limits) {

        return (this.x <0) || (this.y<0) || (this.x>limits.width) || (this.y>limits.height);
    },

    setInsideLimits: function(limits) {

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

    addToRotation: function(deltaRotation) {

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
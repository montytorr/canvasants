var AntApp = AntApp || {};

AntApp.Food = function(options) {

    this.init(options);
};

AntApp.Food.prototype = {

    COLOR: "#008",

    paperLib: null,
    x: false,
    y: false,
    width: false,
    height: false,
    totalFood: false,
    shape: null,

    init: function(options) {

        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.paperLib = options.paperLib;
        this.antFarm = options.antFarm;

        this.totalFood = options.totalFood;
        this.remainingFood = this.totalFood;

        this.initView();
    },

    initView: function() {

        this.shape = new this.paperLib.Path.Rectangle(this.x, this.y, this.width, this.height);
        this.shape.style = {
            fillColor: this.COLOR
        };
    }
};
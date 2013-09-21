window.onload = function() {

    // Get a reference to the canvas object
    var canvas = document.getElementById('js-ant-farm-canvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    var antFarm = AntApp.AntFarm({
        paperLib: paper,
        canvas: canvas,
        ants: 400
    });

    paper.view.onFrame = function(event) {

        antFarm.updateFarm(event);
    };
};


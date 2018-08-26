var secondScene = function () {
    var scene = new BABYLON.Scene(engine);

    var sky = setSky(scene)
    var light = setLight(scene)
    var camera = flightCam(scene)
    var ground = createGround(scene)
    var water = createWater(scene, sky, ground)
    // var panel=createPanel(scene)
    BABYLON.SceneLoader.LoadAssetContainer("./mesh/f117/", "f117.obj", scene, onSuccess = function (data) {
        data.meshes.forEach(element => {
            element.position.y += 10
        });
        data.addAllToScene();
    });

    scene.onPointerDown = function () {
        scene.onPointerDown = undefined
        camera.attachControl(canvas, true);
    }


    var vrHelper = scene.createDefaultVRExperience();
    vrHelper.enableTeleportation({
        floorMeshes: [ground]
    });
    vrHelper.displayGaze = true
    vrHelper.displayLaserPointer = true
    vrHelper.enableInteractions();
    // vrHelper.enterVR()
    return scene;
};

function flightCam(scene) {
    var camera = new BABYLON.UniversalCamera("flightCam", new BABYLON.Vector3(400, 100, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    // var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 200, BABYLON.Vector3.Zero(), scene);
    // camera.attachControl(canvas, false, false);
    return camera
}
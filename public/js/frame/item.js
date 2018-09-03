// environment
function frameGround(scene) {
    var groundTexture = new BABYLON.Texture("textures/grid12.png", scene);
    groundTexture.vScale = groundTexture.uScale = 20.0;

    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;

    var ground = BABYLON.Mesh.CreateGround("ground", 4000, 4000, 1, scene, false);
    ground.position.y = -10;
    ground.material = groundMaterial;
    return ground
}

function setLight(scene) {
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light
}
// camera
function radarCam(scene) {
    var camera = new BABYLON.UniversalCamera("flightCam", new BABYLON.Vector3(400, 100, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    return camera
}

function setCamera(scene) {
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 320, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false, false);
    return camera
}

function sideCam(scene) {
    var camera = new BABYLON.UniversalCamera("sideCam", new BABYLON.Vector3(400, 100, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    return camera
}

function frontCam(scene) {
    var camera = new BABYLON.UniversalCamera("frontCam", new BABYLON.Vector3(0, 100, -400), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    return camera
}

function vr(scene, ground) {
    var vrHelper = scene.createDefaultVRExperience();
    vrHelper.enableTeleportation({
        floorMeshes: [ground]
    });
    vrHelper.displayGaze = true
    vrHelper.displayLaserPointer = true
    vrHelper.enableInteractions();
    return vrHelper
}
// wave
function createBackSphere(scene, position, towards = new BABYLON.Vector3(257, 15, -98)) {
    let material_sphere = new BABYLON.StandardMaterial('spheremat', scene);
    material_sphere.diffuseColor = new BABYLON.Color3(0.2, 0.3, 0.6);
    material_sphere.diffuseColor.hasAlpha = true;
    material_sphere.alpha = 0.5

    let hoop = BABYLON.MeshBuilder.CreateTorus("hoop", {
        thickness: 0.1,
        tessellation: 36
    }, scene);
    hoop.scaling = new BABYLON.Vector3(5, 5, 5)
    // hoop.position=towards
    hoop.position = position
    hoop.material = material_sphere
    hoop.outlineColor = new BABYLON.Color3(0.4, 0.4, 0.4)

    hoop.lookAt(towards)
    hoop.rotation.x = +Math.PI * 0.5

    let move = setInterval(() => {
        hoop.lookAt(towards)
        hoop.rotation.x -= Math.PI * 0.5
        hoop.movePOV(0, 15, 0)
        hoop.scaling.z += 0.25
        hoop.scaling.x += 0.25
    }, 10)
    setTimeout(() => {
        hoop.dispose()
        clearInterval(move)
    }, 250)
}

function createRadarSphere(scene, frequence, position, rotation) {
    return setInterval(() => {
        let material_sphere = new BABYLON.StandardMaterial('spheremat', scene);
        material_sphere.diffuseColor = BABYLON.Color3.Gray();
        material_sphere.diffuseColor.hasAlpha = true;
        material_sphere.alpha = 0.3

        let plane = BABYLON.MeshBuilder.CreateSphere("plane", {
            arc: 0.5,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            diameter: 10
        }, scene);
        plane.material = material_sphere;
        plane.rotation = rotation
        plane.position = position
        let scale = setInterval(() => {
            plane.scaling = new BABYLON.Vector3(plane.scaling.x + 0.05, plane.scaling.x + 0.05, plane.scaling.x + 0.05)
            material_sphere.alpha -= 0.0005
        }, 1)
        setTimeout(() => {
            clearInterval(scale)
            plane.dispose()
        }, 5000)
    }, 500 * frequence)
}
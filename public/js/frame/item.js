// environment
function frameGround(scene) {
    var groundTexture = new BABYLON.Texture("textures/grid12.png", scene);
    groundTexture.vScale = groundTexture.uScale = 20.0;

    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;

    var ground = BABYLON.Mesh.CreateGround("ground", 2000, 2000, 1, scene, false);
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
    material_sphere.alpha = 0.3

    let hoop = BABYLON.MeshBuilder.CreateSphere("plane", {
        arc: -0.1,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        diameter: 10,
        slice: 0.5,
    }, scene);
    // let hoop = BABYLON.MeshBuilder.CreateTorus("hoop", {
    //     thickness: 0.1,
    //     tessellation: 32
    // }, scene);
    hoop.scaling = new BABYLON.Vector3(1, 1, 1)
    // hoop.position=towards
    hoop.position = position
    hoop.material = material_sphere
    hoop.outlineColor = new BABYLON.Color3(0.4, 0.4, 0.4)

    hoop.lookAt(towards)
    hoop.rotation.x = +Math.PI * 0.5

    let move = setInterval(() => {
        hoop.lookAt(towards)
        hoop.rotation.x -= Math.PI * 0.5
        hoop.movePOV(0, 30, 0)
        hoop.scaling.z += 0.25
        hoop.scaling.x += 0.25

        if (hoop.position.y <= towards.y + 50) {
            clearInterval(move)
            hoop.dispose()
        }
    }, 100)
}

function createRadarSphere(scene, frequence, position, rotation) {
    let delay = frequence * 1000
    console.log(frequence)
    return setInterval(() => {
        let material_sphere = new BABYLON.StandardMaterial('spheremat', scene);
        material_sphere.diffuseColor = BABYLON.Color3.Gray();
        material_sphere.diffuseColor.hasAlpha = true;
        material_sphere.alpha = 0.3

        let plane = BABYLON.MeshBuilder.CreateSphere("plane", {
            arc: 0.5,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            diameter: 10,
            slice: 1,
        }, scene);
        plane.material = material_sphere;
        plane.rotation = rotation
        plane.position = position

        let keys = []
        keys.push({
            frame: 0,
            value: 1
        })
        keys.push({
            frame: 600,
            value: 150
        })

        let keys_alpha = []
        keys_alpha.push({
            frame: 0,
            value: 0.3
        })
        keys_alpha.push({
            frame: 180,
            value: 0
        })
        var animationX = new BABYLON.Animation("tutoAnimation", "scaling.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var animationY = new BABYLON.Animation("tutoAnimation", "scaling.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var animationZ = new BABYLON.Animation("tutoAnimation", "scaling.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var sphereAlpha = new BABYLON.Animation("tutoAnimation", "material.alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        sphereAlpha.setKeys(keys_alpha)
        animationX.setKeys(keys);
        animationY.setKeys(keys);
        animationZ.setKeys(keys);

        plane.animations.push(animationX);
        plane.animations.push(animationY);
        plane.animations.push(animationZ);
        plane.animations.push(sphereAlpha);
        // console.log(plane)

        setTimeout(async () => {
            let anim = scene.beginAnimation(plane, 0, 180, false);
            // console.log("before");
            await anim.waitAsync();
            // console.log("after");
            plane.dispose()
        });
    }, delay)
}
function addVideo(type="side",url="./video/video_1.mp4"){
    var screen = BABYLON.MeshBuilder.CreatePlane("screen",{height:90/3, width: 160/3},scene)
    screen.billboardMode=2
    if(type=="front"){
        screen.position.y=80
        screen.position.x=0
        screen.position.z=-300
        screen.rotation.x=0.5
    }else if(type=="side"){
        screen.position.y=80
        screen.position.x=300
        screen.position.z=0
        screen.rotation.x=0.5    
    }
    var mat = new BABYLON.StandardMaterial("mat", scene);

	var videoTexture = new BABYLON.VideoTexture("video", [url], scene, true, false);
    videoTexture.invertZ=false

	mat.diffuseTexture = videoTexture;
	screen.material = mat;
    videoTexture.video.play();

    addCloseButton(screen)

    return screen
}
function addPicture(type="side",url="./textures/result/r1.jpg"){
    var screen = BABYLON.MeshBuilder.CreatePlane("screen",{height:90/3, width: 160/3},scene)
    screen.billboardMode=2
    if(type=="front"){
        screen.position.y=80
        screen.position.x=0
        screen.position.z=-300
        screen.rotation.x=0.5
    }else if(type=="side"){
        screen.position.y=80
        screen.position.x=300
        screen.position.z=0
        screen.rotation.x=0.5    
    }
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = new BABYLON.Texture(url, scene);
    
    screen.material = mat;

    addCloseButton(screen)

    return screen
}

function addA380(assetsManager){
    var meshTask = assetsManager.addMeshTask("a380", "", "./mesh/a380/", "a380.obj");
    meshTask.onSuccess = function (task) {
        task.loadedMeshes.forEach((element)=>{
            element.position.y+=180
            element.position.x-=100
            element.position.z-=210
        })
    }
    assetsManager.load();
}

function addF117(assetsManager){
    var meshTask = assetsManager.addMeshTask("f117", "", "./mesh/f117/", "f117.obj");
    meshTask.onSuccess = function (task) {
        task.loadedMeshes.forEach((element)=>{
            element.position.y+=10
        })
    }
    assetsManager.load();
}

function sideCam(scene) {
    var camera = new BABYLON.UniversalCamera("sideCam", new BABYLON.Vector3(400, 100, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    return camera
}

function frontCam(scene){
    var camera = new BABYLON.UniversalCamera("frontCam", new BABYLON.Vector3(0, 100, -400), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    return camera
}

function addBackButton(title){
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    var button = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/backspace.png");
    button.alpha=0.5
    button.width = "74px";
    button.height = "50px";
    button.color = "#333";
    button.background = "white";
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    advancedTexture.addControl(button);    
    
    button.onPointerClickObservable.add(function(){
        scene.dispose()
        scene=beginScene()
    })

    header = new BABYLON.GUI.TextBlock();
    header.text = title;
    header.height = "40px";
    header.color = "black";
    header.horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    header.verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    header.paddingLeft = "100px";
    header.paddingTop = "10px";
    advancedTexture.addControl(header)
}

function vr(scene,ground){
    var vrHelper = scene.createDefaultVRExperience();
    vrHelper.enableTeleportation({
        floorMeshes: [ground]
    });
    vrHelper.displayGaze = true
    vrHelper.displayLaserPointer = true
    vrHelper.enableInteractions();
    return vrHelper
}

function setCamera(scene) {
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 320, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false, false);
    return camera
}

function createWater(scene) {
    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 4000, 4000, 10, scene, false);
    var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(1024, 1024));
    water.backFaceCulling = true;
    water.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);
    water.windForce = 5;
    water.waveHeight = 0.5;
    water.bumpHeight = 0.1;
    water.waveLength = 0.1;
    water.colorBlendFactor = 0;

    for (let i = 1; i < arguments.length; i++) {
        water.addToRenderList(arguments[i])
    }

    waterMesh.material = water;
    waterMesh.position.y = -10
    return waterMesh
}

function createGround(scene) {
    var groundTexture = new BABYLON.Texture("textures/sand.jpg", scene);
    groundTexture.vScale = groundTexture.uScale = 4.0;

    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;

    var ground = BABYLON.Mesh.CreateGround("ground", 4000, 4000, 5, scene, false);
    ground.position.y = -10;
    ground.material = groundMaterial;
    return ground
}

function setSky(scene) {
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
        size: 5000.0
    }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    return skybox
}

function setLight(scene) {
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light
}

function createRadarWave(scene,frequence,x=0,y=0,z=0){
    var particleSystem = new BABYLON.ParticleSystem("particles", 200000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("/textures/flare.png", scene);
    particleSystem.emitter = BABYLON.Vector3.Zero(); // the starting location

    particleSystem.color1 = new BABYLON.Color4(1.0, 0.4, 0.4, 1.0);
    particleSystem.color2 = new BABYLON.Color4(1.0, 0.5, 0.2, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    particleSystem.minSize = 3.0;
    particleSystem.maxSize = 3.0;

    particleSystem.minLifeTime = 10.0;
    particleSystem.maxLifeTime = 10.0;

    particleSystem.emitRate = 30000;
    particleSystem.emitter=new BABYLON.Vector3(0,20,0)

    var hemisphericEmitter = particleSystem.createSphereEmitter(2);
    hemisphericEmitter.radiusRange = 3;

    particleSystem.minEmitPower = 40;
    particleSystem.maxEmitPower = 40;
    particleSystem.updateSpeed = 0.005;

    particleSystem.start();
    setTimeout(()=>{
        particleSystem.stop()
    },200)
    setInterval(()=>{
        particleSystem.start()
        setTimeout(()=>{
            particleSystem.stop()
        },100)
    },frequence)
    particleSystem.emitter.x=x
    particleSystem.emitter.y=y
    particleSystem.emitter.z=z
    console.log(particleSystem)
    return particleSystem
}

function addCloseButton(screen){
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    var button = BABYLON.GUI.Button.CreateSimpleButton("close", "close");
    button.alpha=0.5
    button.width = "74px";
    button.height = "50px";
    button.color = "white";
    button.background = "white";
    // button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    advancedTexture.addControl(button);    
    
    button.onPointerClickObservable.add(function(){
        screen.dispose()
        advancedTexture.dispose()
        video=""
    })
}
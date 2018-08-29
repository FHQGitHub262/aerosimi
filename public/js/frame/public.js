// models
function addRadar(assetsManager,position){
    var meshTask = assetsManager.addMeshTask("radar", "", "./mesh/radar/", "rada.obj");
    meshTask.onSuccess = function (task) {
        let radar= BABYLON.Mesh.MergeMeshes(task.loadedMeshes,true,true)
        radar.scaling=new BABYLON.Vector3(0.1,0.1,0.1)
        radar.rotation=new BABYLON.Vector3(0,Math.PI*0.7,0)

        radar.position=position
    }
    assetsManager.load();
}

function addA380(assetsManager){
    var meshTask = assetsManager.addMeshTask("a380", "", "./mesh/", "a380.obj");
    meshTask.onSuccess = function (task) {
        let a380=BABYLON.Mesh.MergeMeshes(task.loadedMeshes,true,true)
        a380.scaling=new BABYLON.Vector3(0.01,0.01,0.01)
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
        scene=simpleScene()
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

// environment
function createRadarSphere(scene,frequence,position,rotation){
    return setInterval(()=>{
        let material_sphere = new BABYLON.StandardMaterial('spheremat', scene);
        material_sphere.diffuseColor = BABYLON.Color3.Gray();
        material_sphere.diffuseColor.hasAlpha = true;
        material_sphere.alpha=0.3

        let plane = BABYLON.MeshBuilder.CreateSphere("plane", {arc:0.5,sideOrientation: BABYLON.Mesh.DOUBLESIDE,diameter: 10}, scene);
        plane.material = material_sphere;
        plane.rotation=rotation
        plane.position=position
        let scale=setInterval(()=>{
            plane.scaling=new BABYLON.Vector3(plane.scaling.x+0.05,plane.scaling.x+0.05,plane.scaling.x+0.05)
            material_sphere.alpha-=0.0005
        },1)
        setTimeout(()=>{
            clearInterval(scale)
            plane.dispose()
        },10000)
    },500*frequence)
}

function frameGround(scene){
    var groundTexture = new BABYLON.Texture("textures/grid12.png", scene);
    groundTexture.vScale = groundTexture.uScale = 20.0;

    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;

    var ground = BABYLON.Mesh.CreateGround("ground", 4000, 4000, 1, scene, false);
    ground.position.y = -10;
    ground.material = groundMaterial;
    return ground
}

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

function frontCam(scene){
    var camera = new BABYLON.UniversalCamera("frontCam", new BABYLON.Vector3(0, 100, -400), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    return camera
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
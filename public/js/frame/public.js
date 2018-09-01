// models
function addRadar(assetsManager,position,rotation=0.7){
    var meshTask = assetsManager.addMeshTask("radar", "", "./mesh/radar/", "rada.obj");
    meshTask.onSuccess = function (task) {
        let radar= BABYLON.Mesh.MergeMeshes(task.loadedMeshes,true,true)
        radar.scaling=new BABYLON.Vector3(0.1,0.1,0.1)
        radar.rotation=new BABYLON.Vector3(0,Math.PI*rotation,0)
        radar.state="radar"
        radar.position=position
    }
}

function addA380(assetsManager){
    var meshTask = assetsManager.addMeshTask("a380", "", "./mesh/a380/", "a380.obj");
    meshTask.onSuccess = function (task) {
        let a380=BABYLON.Mesh.MergeMeshes(task.loadedMeshes,true,true)
        a380.scaling=new BABYLON.Vector3(0.00175,0.00175,0.00175)
        a380.position.y+=100
        a380.position.x=0
        a380.position.z=300
        a380.rotation=new BABYLON.Vector3(0,Math.PI,0)
        a380.state="a380"
    }
}

function addF117(assetsManager,scaling=new BABYLON.Vector3(0.2,0.2,0.2),y=100,z=300){
    var meshTask = assetsManager.addMeshTask("f117", "", "./mesh/f117/", "f117.obj");
    meshTask.onSuccess = function (task) {
        let f117=BABYLON.Mesh.MergeMeshes(task.loadedMeshes,true,true)
        f117.position.y+=y
        f117.position.x=0        
        f117.position.z=z
        let mat=new BABYLON.StandardMaterial()
        mat.diffuseColor = new BABYLON.Color3(0.28, 0.3, 0.3);
        f117.scaling=scaling
        f117.material=mat
        f117.state="f117"
        console.log(f117)
    }
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
    header.color = "white";
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
    button.background = "gray";

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
        },5000)
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

function addVideo(type="side",url=getVideoUrl()){
    var screen = BABYLON.MeshBuilder.CreatePlane("screen",{height:90/3, width: 160/3},scene)
    screen.billboardMode=7
    screen.scaling=new BABYLON.Vector3(2,2,2)
    if(type=="front"){
        screen.position.y=80
        screen.position.x=0
        screen.position.z=-300
        // screen.rotation.x=0.5
    }else if(type=="side"){
        screen.position.y=80
        screen.position.x=300
        screen.position.z=0
        // screen.rotation.x=0.5    
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
function addPicture(type="side",url=getPictureUrl()){
    var screen = BABYLON.MeshBuilder.CreatePlane("screen",{height:90/3, width: 160/3},scene)
    screen.billboardMode=7
    screen.scaling=new BABYLON.Vector3(2,2,2)
    if(type=="front"){
        screen.position.y=80
        screen.position.x=0
        screen.position.z=-300
        // screen.rotation.x=0.5
    }else if(type=="side"){
        screen.position.y=80
        screen.position.x=300
        screen.position.z=0
        // screen.rotation.x=0.5    
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

function createBackSphere(scene,position,towards=new BABYLON.Vector3(257,15,-98)){
    let material_sphere = new BABYLON.StandardMaterial('spheremat', scene);
    material_sphere.diffuseColor = new BABYLON.Color3(0.2,0.3,0.6);
    material_sphere.diffuseColor.hasAlpha = true;
    material_sphere.alpha=0.5

    let hoop = BABYLON.MeshBuilder.CreateTorus("hoop", {thickness: 0.1,tessellation:36}, scene);
    hoop.scaling=new BABYLON.Vector3(5,5,5)
    // hoop.position=towards
    hoop.position=position
    hoop.material=material_sphere
    hoop.outlineColor=new BABYLON.Color3(0.4,0.4,0.4)

    hoop.lookAt(towards)
    hoop.rotation.x=+Math.PI*0.5

    let move=setInterval(()=>{
        hoop.lookAt(towards)
        hoop.rotation.x-=Math.PI*0.5
        hoop.movePOV(0,15,0)
        hoop.scaling.z+=0.25
        hoop.scaling.x+=0.25
    },10)
    setTimeout(()=>{
        hoop.dispose()
        clearInterval(move)
    },250)
}

function getMeshByState(state){
    let item={}
    scene.meshes.forEach((element)=>{
        if(element.state==state){
            item=element
        }
    })
    return item
}

function getVideoUrl(plane,view){
    return "./video/video_1.mp4"
}

function getPictureUrl(plane,view){
    return "./textures/result/r1.jpg"
}
var firstScene = function () {
    var scene = new BABYLON.Scene(engine);

    var sky = setSky(scene)
    var light = setLight(scene)
    var camera = radarCam(scene)
    var ground = createGround(scene)
    var water = createWater(scene, sky, ground)
    var wave=createRadarWave(scene)
    // var panel=createPanel(scene)
    addRadarPanel()

    // BABYLON.SceneLoader.LoadAssetContainer("./mesh/f117/", "f117.obj", scene, onSuccess = function (data) {
    //     data.meshes.forEach(element => {
    //         element.position.y += 10
    //     });
    //     data.addAllToScene();
    // });

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

function addRadarPanel() {
    let frequence = "NaN"
    let columns = [
        "433MHz",
        "2GHz"
    ]
    // Plane
    var plane_r = BABYLON.Mesh.CreatePlane("plane", 40);
    plane_r.position.x = 250;
    plane_r.position.y = 100
    plane_r.position.z = 60
    // plane_r.rotation = new BABYLON.Vector3(0, -0.7, 0)
    plane_r.billboardMode=2

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane_r);

    var panel = new BABYLON.GUI.StackPanel();
    panel.top = "100px";
    advancedTexture.addControl(panel);

    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "开始实验");
    button1.width = 1;
    button1.height = "100px";
    button1.color = "white";
    button1.fontSize = 50;
    button1.background = "orange";
    panel.addControl(button1);
    button1.onPointerClickObservable.add(() => {
        switch (next) {
            case columns[0]:
                text1.text="433MHz"
                console.log("type1")
                break
            case columns[1]:
                text1.text="2GHz"
                console.log("type2")
                break
            default:
                textblock.text = "请先选中实验再开始"
        }
    })

    var textblock = new BABYLON.GUI.TextBlock();
    textblock.height = "150px";
    textblock.fontSize = 100;
    textblock.text = "电磁波频率";
    panel.addControl(textblock);

    var addRadio = function (text, parent) {
        var button = new BABYLON.GUI.RadioButton();
        button.width = "40px";
        button.height = "40px";
        button.color = "white";
        button.background = "orange";

        button.onIsCheckedChangedObservable.add(function (state) {
            if (state) {
                textblock.text = "当前：" + text;
                next = text
            }
        });

        var header = BABYLON.GUI.Control.AddHeader(button, text, "400px", {
            isHorizontal: true,
            controlFirst: true
        });
        header.height = "150px";
        header.children[1].fontSize = 60;
        header.children[1].onPointerDownObservable.add(function () {
            button.isChecked = !button.isChecked;
        });

        parent.addControl(header);
    }

    columns.forEach(element => {
        addRadio(element, panel)
    });

    // ------------------------------------------------
    var plane_l = BABYLON.Mesh.CreatePlane("plane",40);
    plane_l.position.x = 250;
    plane_l.position.y = 100
    plane_l.position.z = -60
    plane_l.rotation = new BABYLON.Vector3(0, 0, 0)
    plane_l.billboardMode=2

    var advancedTexture_l = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane_l)

    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = "尚未选择频率";
    text1.color = "gray";
    text1.fontSize = 80;
    // text1.resizeToFit = true
    advancedTexture_l.addControl(text1);
}

function radarCam(scene) {
    var camera = new BABYLON.UniversalCamera("flightCam", new BABYLON.Vector3(400, 100, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    // var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 200, BABYLON.Vector3.Zero(), scene);
    // camera.attachControl(canvas, false, false);
    return camera
}

function createRadarWave(scene){
    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 200000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("/textures/flare.png", scene);

    // Where the particles come from
    particleSystem.emitter = BABYLON.Vector3.Zero(); // the starting location

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(1.0, 0.4, 0.4, 1.0);
    particleSystem.color2 = new BABYLON.Color4(1.0, 0.5, 0.2, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 3.0;
    particleSystem.maxSize = 3.0;
    // particleSystem.direction1=new BABYLON.Vector3(1,1,1)
    // particleSystem.direction2=new BABYLON.Vector3(1,1,1)
    // Life time of each particle (random between...
    particleSystem.minLifeTime = 10.0;
    particleSystem.maxLifeTime = 10.0;

    // Emission rate
    particleSystem.emitRate = 30000;
    particleSystem.emitter=new BABYLON.Vector3(0,20,0)

    /******* Emission Space ********/
    var hemisphericEmitter = particleSystem.createSphereEmitter(2);
    hemisphericEmitter.radiusRange = 3;

    // Speed
    particleSystem.minEmitPower = 40;
    particleSystem.maxEmitPower = 40;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();
    setTimeout(()=>{
        particleSystem.stop()
    },200)
    setInterval(()=>{
        particleSystem.stop()
        setTimeout(()=>{
            particleSystem.start()
        },2900)
    },3000)
    return particleSystem
}
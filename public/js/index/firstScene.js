var firstScene = function () {
    var scene = new BABYLON.Scene(engine);

    video=""
    type="side"

    var assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.onTaskError = function (task) {
        console.log("error while loading " + task.name);
    }
    assetsManager.addBinaryFileTask("binary task", "textures/sand.jpg")
    assetsManager.addBinaryFileTask("skybox","textures/TropicalSunnyDay/TropicalSunnyDay")
    assetsManager.addBinaryFileTask("water","textures/waterbump.png")

    engine.loadingUIBackgroundColor = "Black";
    assetsManager.load();

    var sky = setSky(scene)
    var light = setLight(scene)
    var camera = radarCam(scene)
    var ground = createGround(scene)
    var water = createWater(scene, sky, ground)
    addRadarPanel()

    var tri_panel = addBackButton("电磁辐射")

    scene.onPointerDown = function () {
        scene.onPointerDown = undefined
        camera.attachControl(canvas, true);
    }

    var vrHelper = vr(scene,ground)
    return scene;
};

function addRadarPanel() {
    let frequence = "NaN"
    let columns = [
        "433MHz",
        "2.4GHz"
    ]
    let wave=""
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
        if(video=="")
            video=addPicture(type)
    })

    var textblock = new BABYLON.GUI.TextBlock();
    textblock.height = "150px";
    textblock.fontSize = 100;
    textblock.text = "电磁波频率";
    panel.addControl(textblock);

    var addRadio = function (text, parent,textblock,callback=function(state){
        if (state) {
            textblock.text = "当前：" + text;
            next = text
        }
    }){
        var button = new BABYLON.GUI.RadioButton();
        button.width = "40px";
        button.height = "40px";
        button.color = "white";
        button.background = "orange";
    
        button.onIsCheckedChangedObservable.add(callback);
    
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
        addRadio(element, panel,textblock,(state)=>{
            if (state) {
                textblock.text = "当前：" + element;
                next = element
                if(element=="433MHz"){
                    if(wave!="")
                        wave.dispose()
                    wave=createRadarWave(scene,5000)
                }else if(element=="2.4GHz"){
                    if(wave!="")
                        wave.dispose()
                    wave=createRadarWave(scene,3000)
                }
            }
        })
    });

}

function radarCam(scene) {
    var camera = new BABYLON.UniversalCamera("flightCam", new BABYLON.Vector3(400, 100, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    return camera
}


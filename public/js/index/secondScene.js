var secondScene = function () {
    var scene = new BABYLON.Scene(engine);

    var sky = setSky(scene)
    var light = setLight(scene)
    var camera = flightCam(scene)
    var ground = createGround(scene)
    var water = createWater(scene, sky, ground)
    var panel = addAeroPanel(scene)
    // var panel=createPanel(scene)
    // addF117(scene)
    addA380(scene)

    scene.onPointerDown = function () {
        scene.onPointerDown = undefined
        camera.attachControl(canvas, true);
    }


    var vrHelper = scene.createDefaultVRExperience();
    // vrHelper.enableTeleportation({
    //     floorMeshes: [ground]
    // });
    vrHelper.displayGaze = true
    vrHelper.displayLaserPointer = true
    vrHelper.enableInteractions();
    // vrHelper.enterVR()
    return scene;
};

// -----------------------------------------
function addA380(scene){
    BABYLON.SceneLoader.LoadAssetContainer("./mesh/a380/", "a380.obj", scene, onSuccess = function (data) {
        console.log(data)
        data.meshes.forEach(element => {
            element.position.y += 180
            element.position.x-=100
            element.position.z-=210
        });
        data.addAllToScene();
    });
}

function addF117(scene){
    BABYLON.SceneLoader.LoadAssetContainer("./mesh/f117/", "f117.obj", scene, onSuccess = function (data) {
        data.meshes.forEach(element => {
            element.position.y += 10
        });
        data.addAllToScene();
    });
}

function flightCam(scene) {
    // var camera = new BABYLON.UniversalCamera("flightCam", new BABYLON.Vector3(0, 10, 0), scene);
    var camera = new BABYLON.UniversalCamera("flightCam", new BABYLON.Vector3(400, 100, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    return camera
}

function addAeroPanel() {
    var addRadio = function (text, parent,textblock) {
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

    let frequence = "NaN"
    let columns = [
        "F117",
        "A380"
    ]
    var columns_l = [
        "正视图",
        "侧视图"
    ]
    var columns_radar=[
        "433MHz",
        "2.4GHz"
    ]
    // Plane
    var plane_r = BABYLON.Mesh.CreatePlane("plane",25);
    // plane_r.height=100
    plane_r.position.x = 300;
    plane_r.position.y = 100
    plane_r.position.z = 60
    plane_r.billboardMode = 2

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane_r);

    var panel = new BABYLON.GUI.StackPanel();
    panel.top = "0px";
    advancedTexture.addControl(panel);

    // -------------------------------------------
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
                text1.text = "433MHz"
                console.log("type1")
                break
            case columns[1]:
                text1.text = "2GHz"
                console.log("type2")
                break
            default:
                textblock.text = "请先完成设置"
        }
    })

    var textblock = new BABYLON.GUI.TextBlock();
    textblock.height = "150px";
    textblock.fontSize = 100;
    textblock.text = "选择机型";
    panel.addControl(textblock);

    columns.forEach(element => {
        addRadio(element, panel,textblock)
    });

    
    var textblock_r2 = new BABYLON.GUI.TextBlock();
    textblock_r2.height = "150px";
    textblock_r2.fontSize = 100;
    textblock_r2.text = "选择角度";
    panel.addControl(textblock_r2);    
    
    columns_l.forEach(element => {
        addRadio(element, panel,textblock_r2)
    });
    // ------------------------------------------------


    var plane_l = BABYLON.Mesh.CreatePlane("plane_l", 25);
    plane_l.position.x = 300;
    plane_l.position.y = 100
    plane_l.position.z = -60
    plane_l.billboardMode = 2

    var advancedTexture_l = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane_l)

    var panel_l = new BABYLON.GUI.StackPanel();
    panel_l.top = "0px";
    advancedTexture_l.addControl(panel_l);

    var textblock_l = new BABYLON.GUI.TextBlock();
    textblock_l.height = "150px";
    textblock_l.fontSize = 100;
    textblock_l.text = "雷达类型";
    panel_l.addControl(textblock_l);

    columns_radar.forEach(element => {
        addRadio(element, panel_l,textblock_l)
    });
}

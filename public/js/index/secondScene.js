var secondScene = function () {
    var scene = new BABYLON.Scene(engine);

    var sky = setSky(scene)
    var light = setLight(scene)
    var camera = flightCam(scene)
    var ground = createGround(scene)
    var water = createWater(scene, sky, ground)
    var panel = addF117Panel(scene)
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

function addF117Panel() {
    let frequence = "NaN"
    let columns = [
        "F117",
        "A380"
    ]
    // Plane
    var plane_r = BABYLON.Mesh.CreatePlane("plane", 40);
    plane_r.position.x = 250;
    plane_r.position.y = 100
    plane_r.position.z = 60
    // plane_r.rotation = new BABYLON.Vector3(0, -0.7, 0)
    plane_r.billboardMode = 2

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
                text1.text = "433MHz"
                console.log("type1")
                break
            case columns[1]:
                text1.text = "2GHz"
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
    columns_l = [
        "正视图",
        "侧视图"
    ]

    var plane_l = BABYLON.Mesh.CreatePlane("plane_l", 40);
    plane_l.position.x = 250;
    plane_l.position.y = 100
    plane_l.position.z = -60
    plane_l.rotation = new BABYLON.Vector3(0, 0, 0)
    plane_l.billboardMode = 2

    var advancedTexture_l = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane_l)

    var panel_l = new BABYLON.GUI.StackPanel();
    panel_l.top = "100px";
    advancedTexture_l.addControl(panel_l);

    var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "确认角度");
    button2.width = 1;
    button2.height = "100px";
    button2.color = "white";
    button2.fontSize = 50;
    button2.background = "orange";
    panel_l.addControl(button2);
    button2.onPointerClickObservable.add(() => {
        switch (next) {
            case columns[0]:
                textblock_l.text = "正视图"
                console.log("type1")
                break
            case columns[1]:
                textblock_l.text = "侧视图"
                console.log("type2")
                break
            default:
                textblock.text = "请先选中实验再开始"
        }
    })

    var textblock_l = new BABYLON.GUI.TextBlock();
    textblock_l.height = "150px";
    textblock_l.fontSize = 100;
    textblock_l.text = "观察角度";
    panel_l.addControl(textblock_l);

    columns_l.forEach(element => {
        addRadio(element, panel_l)
    });
}
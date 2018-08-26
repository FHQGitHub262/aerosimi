var firstScene = function () {
    var scene = new BABYLON.Scene(engine);

    var sky = setSky(scene)
    var light = setLight(scene)
    var camera = radarCam(scene)
    var ground = createGround(scene)
    var water = createWater(scene, sky, ground)
    // var panel=createPanel(scene)
    addRadarPanel()

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
    plane_r.rotation = new BABYLON.Vector3(0, -0.7, 0)

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
                scene = firstScene()
                break
            case columns[1]:
                scene = firstScene()
                break
            case columns[2]:
                scene = firstScene()
                break
            case columns[3]:
                scene = firstScene()
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
    var plane_l = BABYLON.Mesh.CreatePlane("plane", 40);
    plane_l.position.x = 250;
    plane_l.position.y = 100
    plane_l.position.z = -60
    plane_l.rotation = new BABYLON.Vector3(0, 0.1, 0)

    var advancedTexture_l = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane_l)

    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = "Hello world";
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
var simpleScene = function () {
    let scene = new BABYLON.Scene(engine);
    setLight(scene)
    let camera = setCamera(scene)
    let ground = frameGround(scene)
    vr(scene, ground)


    addBackButton("test")
    createPanel()
    var assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.onTaskError = function (task) {
        console.log("error while loading " + task.name);
    }

    addF117(assetsManager, new BABYLON.Vector3(0.8, 0.8, 0.8), 30, 0)

    engine.loadingUIBackgroundColor = "Black";
    assetsManager.load();

    scene.onPointerDown = function () {
        scene.onPointerDown = undefined
        camera.attachControl(canvas, true);
    }


    return scene;
}

function createPanel() {
    let next = ""
    let columns = [
        "电磁辐射",
        "表面电场分布（频率）",
        "表面电场分布（时间）",
        "RCS测量"
    ]
    // Plane
    var plane = BABYLON.Mesh.CreatePlane("plane", 20);
    plane.position.y = 3;
    plane.position.z = -290
    plane.billboardMode = 7

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

    var panel = new BABYLON.GUI.StackPanel();
    panel.top = "100px";
    panel.background = "white"
    panel.alpha = 0.8
    advancedTexture.addControl(panel);

    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "开始实验");
    button1.width = 1;
    button1.height = "100px";
    button1.color = "white";
    button1.fontSize = 50;
    button1.background = "orange";
    panel.addControl(button1);
    // button1.onPointerClickObservable.add(() => {
    //     switch (next) {
    //         case columns[0]:
    //             scene.dispose()
    //             scene = firstScene()
    //             break
    //         case columns[1]:
    //             scene.dispose()
    //             scene = secondScene()
    //             break
    //         case columns[2]:
    //             scene.dispose()
    //             scene = thirdScene()
    //             break
    //         case columns[3]:
    //             scene.dispose()
    //             scene = forthScene_d()
    //             break
    //         default:
    //             textblock.text = "请先选中实验再开始"
    //     }
    // })

    // var textblock = new BABYLON.GUI.TextBlock();
    // textblock.height = "150px";
    // textblock.fontSize = 70;
    // textblock.text = "请选择一个实验:";
    // textblock.color = "black"
    // textblock.alpha = 0.7
    // panel.addControl(textblock);

    var addRadio = function (text, parent) {
        var button = new BABYLON.GUI.RadioButton();
        button.width = "40px";
        button.height = "40px";
        button.color = "white";
        button.background = "orange";

        button.onIsCheckedChangedObservable.add(function (state) {
            if (state) {
                // switc(text) {
                //     case columns[0]:
                //         scene.dispose()
                //         scene = firstScene()
                // }
            }
        });

        var header = BABYLON.GUI.Control.AddHeader(button, text, "400px", {
            isHorizontal: true,
            controlFirst: true
        });
        header.height = "150px";
        header.color = "black"
        header.alpha = 0.7
        header.children[1].fontSize = 40;
        header.children[1].onPointerDownObservable.add(function () {
            button.isChecked = !button.isChecked;
        });

        parent.addControl(header);
    }

    columns.forEach(element => {
        addRadio(element, panel)
    });
    return panel.mesh
}
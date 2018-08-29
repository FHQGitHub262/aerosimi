var secondScene = function (aeroplane="F117") {
    var scene = new BABYLON.Scene(engine);

    type="side"
    video=""

    var sky = setSky(scene)
    var light = setLight(scene)
    frontCamera = frontCam(scene)
    sideCamera=sideCam(scene)
    scene.activeCamera=sideCamera
    var ground = createGround(scene)
    var water = createWater(scene, sky, ground)
    var two_panel = addTimePanel(scene)
    var vrHelper=vr(scene,ground)
    var tri_panel = addBackButton("表面电场分布（频率）")

    var assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.onTaskError = function (task) {
        console.log("error while loading " + task.name);
    }
    assetsManager.onFinish = function (tasks) {
        engine.runRenderLoop(function () {
            scene.render();
        });
    };
    if(aeroplane=="F117"){
        // addRadar(assetsManager,new BABYLON.Vector3(260,-10,-100))
        addF117(assetsManager,scene)
    }else{
        addRadar(assetsManager,new BABYLON.Vector3(260,-10,-100))
        addA380(assetsManager,scene)
    }

    return scene;
};

// -----------------------------------------
function addTimePanel(scene_t) {
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
    wave=""

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
        video=addPicture(type)
    })

    columns.forEach(element => {
        addRadio(element, panel,textblock_r2,(state)=>{
            if (state) {
                if(element=="F117"){
                    scene.dispose()
                    scene=secondScene("F117")
                }else{
                    scene.dispose()
                    scene=secondScene("A380")
                }
            }
        })
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
        addRadio(element, panel_l,textblock_l,(state)=>{
            if (state) {
                textblock_l.text = "当前：" + element;
                if(element=="433MHz"){
                    if(wave!=""){
                        clearInterval(wave)
                        wave=""
                    }
                    wave=createRadarSphere(scene,2,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
                        // wave.dispose()
                    // wave=createRadarWave(scene_t,5000)
                }else if(element=="2.4GHz"){
                    if(wave!=""){
                        clearInterval(wave)
                        wave=""
                    }
                    wave=createRadarSphere(scene,0.7,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
                    // wave=createRadarWave(scene_t,3000)
                }
            }
        })
    });

    // -------------------------------------------------
    var plane_r2 = BABYLON.Mesh.CreatePlane("plane",25);
    // plane_r.height=100
    plane_r2.position.x = 300;
    plane_r2.position.y = 88
    plane_r2.position.z = 60
    plane_r2.billboardMode = 2

    // GUI
    var advancedTexture_r2 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane_r2);

    var panel_r2 = new BABYLON.GUI.StackPanel();
    panel_r2.top = "0px";
    advancedTexture_r2.addControl(panel_r2);

    var textblock_r2 = new BABYLON.GUI.TextBlock();
    textblock_r2.height = "150px";
    textblock_r2.fontSize = 100;
    textblock_r2.text = "选择角度";
    panel_r2.addControl(textblock_r2);

    columns_l.forEach(element => {
        addRadio(element, panel_r2,textblock_r2,(state)=>{
            if (state) {
                console.log(state)
                textblock_r2.text = "当前：" + element;
                if(element=="正视图"){
                    plane_r.position=new BABYLON.Vector3(60,100,-300)
                    plane_r2.position=new BABYLON.Vector3(60,88,-300)
                    plane_l.position=new BABYLON.Vector3(-60,100,-300)
                    type="front"
                    scene.activeCamera=frontCamera
                }else{
                    plane_r.position=new BABYLON.Vector3(300,100,60)
                    plane_r2.position=new BABYLON.Vector3(300,88,60)
                    plane_l.position=new BABYLON.Vector3(300,100,-60)
                    type="side"
                    scene.activeCamera=sideCamera
                }
                if(video!=""){
                    video.dispose()
                    video=""
                }
            }
        })
    });
}
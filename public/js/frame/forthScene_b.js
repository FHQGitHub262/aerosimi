var forthScene_b = function (aeroplane="F117") {
    var scene = new BABYLON.Scene(engine);

    type="side"
    video=""

    var light = setLight(scene)
    frontCamera = frontCam(scene)
    sideCamera=sideCam(scene)
    scene.activeCamera=sideCamera
    var ground = frameGround(scene)
    var two_panel = addRCSPanel_b(scene,aeroplane)
    var vrHelper=vr(scene,ground)
    var tri_panel = addBackButton("RCS测量")

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
        addRadar(assetsManager,new BABYLON.Vector3(260,-10,-100))
        // addRadar(assetsManager,new BABYLON.Vector3(260,-10,100),0.3)
        addF117(assetsManager,scene)
        assetsManager.load();
    }else{
        addRadar(assetsManager,new BABYLON.Vector3(260,-10,-100))
        // addRadar(assetsManager,new BABYLON.Vector3(260,-10,100),0.3)
        addA380(assetsManager,scene)
        assetsManager.load();
    }
    return scene;
};

// -----------------------------------------
function addRCSPanel_b(scene_t,aeroplane) {
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

    var columns_l2=[
        "单雷达",
        "双雷达"
    ]
    // Plane
    var plane_r = BABYLON.Mesh.CreatePlane("plane",25);
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
        if(aeroplane!=""&&wave!=""&&type!=""){
            scene.meshes.forEach((element)=>{
                if(element.name=="t02_merged"||element.name=="Archmod73_0407_merged"){
                    console.log("aeroflyb",element.position)
                    aerofly_b(element)
                }
                setTimeout(()=>{
                    video=addVideo("side")
                },3000)
            })
        }else{
            alert("请填写完所有参数")
        }
    })

    columns.forEach(element => {
        addRadio(element, panel,textblock_r2,(state)=>{
            if (state) {
                if(element=="F117"){
                    scene.dispose()
                    scene=forthScene_b("F117")
                }else{
                    scene.dispose()
                    scene=forthScene_b("A380")
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
            console.log(state)
            if (state) {
                textblock_l.text = "当前：" + element;
                if(element=="433MHz"){
                    if(wave!=""){
                        clearInterval(wave)
                        wave=createRadarSphere(scene,2,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
                    }else{
                        wave=createRadarSphere(scene,2,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
                    }
                    setTimeout(()=>{
                        clearInterval(wave)
                        wave=""
                    },5000)
                }else if(element=="2.4GHz"){
                    if(wave!=""){
                        clearInterval(wave)
                        wave=createRadarSphere(scene,0.7,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
                    }else{
                        wave=createRadarSphere(scene,0.7,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
                    }
                    setTimeout(()=>{
                        clearInterval(wave)
                        wave=""
                    },5000)
                }
            }
        })
    });

    // -------------------------------------------------
    var plane_r2 = BABYLON.Mesh.CreatePlane("plane",25);
    // plane_r.height=100
    plane_r2.position.x = 300;
    plane_r2.position.y = 88
    plane_r2.position.z = -60
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
                textblock_r2.text = "当前：" + element;
                if(element=="正视图"){
                    type="front"
                    scene.meshes.forEach((element)=>{
                        if(element.id=="t02_merged"||element.id=="Archmod73_0407_merged"){
                            console.log(element.position)
                            if(element.position.z!=0){
                                element.position=new BABYLON.Vector3(-300,element.position.y,0)
                                element.rotation.y-=0.5*Math.PI    
                            }
                        }
                    })
                }else{
                    scene.meshes.forEach((element)=>{
                        type="side"
                        if(element.id=="t02_merged"||element.id=="Archmod73_0407_merged"){
                            console.log(element.position)
                            if(element.position.x!=0){
                                element.position=new BABYLON.Vector3(0,element.position.y,300)
                                element.rotation.y+=0.5*Math.PI    
                            }
                        }
                    })
                }
                if(video!=""){
                    video.dispose()
                    video=""
                }
            }
        })
    });
    // ----------------------------------------
    var plane_l2 = BABYLON.Mesh.CreatePlane("plane",25);
    // plane_r.height=100
    plane_l2.position.x = 300;
    plane_l2.position.y = 88
    plane_l2.position.z = 60
    plane_l2.billboardMode = 2

    // GUI
    var advancedTexture_l2 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane_l2);

    var panel_l2 = new BABYLON.GUI.StackPanel();
    panel_l2.top = "0px";
    advancedTexture_l2.addControl(panel_l2);

    var textblock_l2 = new BABYLON.GUI.TextBlock();
    textblock_l2.height = "150px";
    textblock_l2.fontSize = 100;
    textblock_l2.text = "选择模式";
    panel_l2.addControl(textblock_l2);

    columns_l2.forEach(element => {
        addRadio(element, panel_l2,textblock_l2,(state)=>{
            if (state) {
                if(element=="单雷达"){
                    scene.dispose()
                    scene=forthScene_b(aeroplane)
                }else{
                    scene.dispose()
                    scene=forthScene_d(aeroplane)
                }
            }
        })
    });
}

function aerofly_b(aeroplane){
    const radar=scene.getMeshByName("??_merged").position
    console.log("b")
    if(aeroplane.position.z==0&&aeroplane.position.x<600){
        let back=0
        setTimeout(()=>{
                back=setInterval(()=>{
                temp_pos=new BABYLON.Vector3(aeroplane.position.x,aeroplane.position.y,aeroplane.position.z)
                createBackSphere(scene,temp_pos)
            },100)
        },200)
        let move=setInterval(()=>{
            aeroplane.position.x+=1
            if(aeroplane.position.x>=600){
                clearInterval(move)
                clearInterval(back)
            }
        },5)
    }else if(aeroplane.position.x==0&&aeroplane.position.z>-600){
        let back=0
        setTimeout(()=>{
            back=setInterval(()=>{
                aeroplane.position.z-=1
                temp_pos=new BABYLON.Vector3(aeroplane.position.x,aeroplane.position.y,aeroplane.position.z)
                createBackSphere(scene,temp_pos)
            },100)
        },200)
        let move=setInterval(()=>{
            aeroplane.position.x+=1
            if(aeroplane.position.x>=600){
                clearInterval(move)
                clearInterval(back)
            }
        },5)
    }
}
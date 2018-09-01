var secondScene = function (aeroplane="F117") {
    var scene = new BABYLON.Scene(engine);

    type="side"
    video=""

    var light = setLight(scene)
    frontCamera = frontCam(scene)
    sideCamera=sideCam(scene)
    scene.activeCamera=sideCamera
    var ground = frameGround(scene)
    var two_panel = addFrequencePanel(scene,aeroplane)
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
        addRadar(assetsManager,new BABYLON.Vector3(260,-10,-100))
        addF117(assetsManager)
        assetsManager.load();
    }else{
        addRadar(assetsManager,new BABYLON.Vector3(260,-10,-100))
        addA380(assetsManager)
        assetsManager.load();
    }
    return scene;
};

// -----------------------------------------
function addFrequencePanel(scene_t,aeroplane) {
    var addRadio = function (text, parent,textblock,callback=function(state){
        if (state) {
            textblock.text = "当前：" + text;
            next = text
        }
    }){
        var button = new BABYLON.GUI.RadioButton();
        button.width = "20px";
        button.height = "20px";
        button.color = "white";
        button.background = "orange";

        button.onIsCheckedChangedObservable.add(callback);

        var header = BABYLON.GUI.Control.AddHeader(button, text, "100px", {
            isHorizontal: true,
            controlFirst: true
        });
        header.height = "75px";
        header.color="black"
        header.children[1].fontSize = 20;
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
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("plane_r");

    var panel = new BABYLON.GUI.StackPanel();
    panel.width="200px"
    panel.height="200px"
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    panel.background="white"
    panel.alpha=0.8
    panel.top=60
    panel.left=30
    advancedTexture.addControl(panel);
    // -------------------------------------------
    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "开始实验");
    button1.width = "200px";
    button1.height = "40px";
    button1.color = "white";
    button1.fontSize = 20;
    button1.background = "orange";
    panel.addControl(button1);
    button1.onPointerClickObservable.add(() => {
        if(aeroplane!=""&&wave!=""&&type!=""){
            scene.meshes.forEach((element)=>{
                if(element.name=="t02_merged"||element.name=="Archmod73_0407_merged"){
                    aerofly_3(element)
                }
                setTimeout(()=>{
                    video=addPicture("side")
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
                    scene=secondScene("F117")
                }else{
                    scene.dispose()
                    scene=secondScene("A380")
                }
            }
        })
    });
    // ------------------------------------------------
    var advancedTexture_l = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("plane_l");

    var panel_l = new BABYLON.GUI.StackPanel();
    panel_l.width="200px"
    panel_l.height="200px"
    panel_l.top = "0px";
    panel_l.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    panel_l.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panel_l.background="white"
    panel_l.alpha=0.8
    panel_l.top=-110
    panel_l.left=30
    advancedTexture_l.addControl(panel_l);

    var textblock_l = new BABYLON.GUI.TextBlock();
    textblock_l.height = "40px";
    textblock_l.fontSize = 25;
    textblock_l.color="black"
    textblock_l.background="orange"
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
    var panel_r2 = new BABYLON.GUI.StackPanel();
    panel_r2.width="200px"
    panel_r2.height="200px"
    panel_r2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel_r2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    panel_r2.background="white"
    panel_r2.alpha=0.8
    panel_r2.top=-280
    panel_r2.left=30
    advancedTexture.addControl(panel_r2);

    var textblock_r2 = new BABYLON.GUI.TextBlock();
    textblock_r2.height = "40px";
    textblock_r2.fontSize = 25;
    textblock_r2.color="black"
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
}

function aerofly_2(aeroplane){
    let temp_pos
    const radar=scene.getMeshByName("??_merged").position
    console.log(radar)
    if(aeroplane.position.z==0&&aeroplane.position.x<600){
        let back=0
        setTimeout(()=>{
                back=setInterval(()=>{
                temp_pos=new BABYLON.Vector3(aeroplane.position.x,aeroplane.position.y,aeroplane.position.z)
                temp_rot=new BABYLON.Vector3(temp_pos.x-radar.x,temp_pos.y-radar.y,temp_pos.z-radar.z)
                createBackSphere(scene,temp_pos,radar)
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
        let move=setInterval(()=>{
            aeroplane.position.z-=1
            temp_pos=new BABYLON.Vector3(aeroplane.position.x,aeroplane.position.y,aeroplane.position.z)
            temp_rot=new BABYLON.Vector3(radar.x-temp_pos.x,radar.y-temp_pos.y,radar.z-temp_pos.z)
            createBackSphere(scene,temp_pos,radar)
            if(aeroplane.position.z<=-600){
                clearInterval(move)
            }
        },5)
    }
}
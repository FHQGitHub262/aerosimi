var forthScene_d = function (aeroplane="F117") {
    var scene = new BABYLON.Scene(engine);

    type="side"
    video=""

    var light = setLight(scene)
    frontCamera = frontCam(scene)
    sideCamera=sideCam(scene)
    scene.activeCamera=sideCamera
    var ground = frameGround(scene)
    var two_panel = addRCSPanel_d(scene,aeroplane)
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
        addRadar(assetsManager,new BABYLON.Vector3(260,-10,100),0.3)
        addF117(assetsManager)
        assetsManager.load();
    }else{
        addRadar(assetsManager,new BABYLON.Vector3(260,-10,-100))
        addRadar(assetsManager,new BABYLON.Vector3(260,-10,100),0.3)
        addA380(assetsManager)
        assetsManager.load();
    }
    return scene;
};

// -----------------------------------------
function addRCSPanel_d(scene_t,aeroplane) {
    wave=""

    let columns = [
        "F117",
        "A380"
    ]
    let columns_l = [
        "正视图",
        "侧视图"
    ]
    let columns_radar=[
        "433MHz",
        "2.4GHz"
    ]
    let columns_l2=[
        "单雷达",
        "双雷达"
    ]
    // aero_type
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("plane_r");
    let panel=pureFormitem(columns,"飞行器类型",30,60,"left","top",onRatioClick=(aero)=>{
        if(aero=="F117"){
            scene.dispose()
            scene=forthScene_d("F117")
        }else{
            scene.dispose()
            scene=forthScene_d("A380")
        }
    })
    advancedTexture.addControl(panel);

    // radar_type
    var advancedTexture_l = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("plane_l");
    let panel_l=downFormitem_s(columns_radar,"开始实验","雷达类型",30,-250,"left","bottom",onRatioClick=(frequency)=>{
        if(frequency=="433MHz"){
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
        }else if(frequency=="2.4GHz"){
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
    },onButtonClick=()=>{
        if(aeroplane!=""&&wave!=""&&type!=""){
            scene.meshes.forEach((element)=>{
                if(element.state=="f117"||element.state=="a380"){
                    aerofly_b(element)
                }
                setTimeout(()=>{
                    video=addVideo("side")
                },4000)
            })
        }else{
            console.log(aeroplane,wave,type)
            alert("请填写完所有参数")
        }
    })
    advancedTexture_l.addControl(panel_l)

    // view_type
    let panel_r2=pureFormitem(columns_l,"选择角度",30,-120,"left","center",onRatioClick=(towards)=>{
        if(towards=="正视图"){
            type="front"
            scene.meshes.forEach((element)=>{
                if(element.state=="f117"||element.state=="a380"){
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
                if(element.state=="f117"||element.state=="a380"){
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
    })
    advancedTexture.addControl(panel_r2);
    // ----------------单双雷达--------------------
    let advancedTexture_l2 = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("model");

    let panel_l2=miniFormitem(columns_l2,"选择模式",-30,10,"right","top",onRatioClick=(value)=>{
        if(element=="单雷达"){
            scene.dispose()
            scene=forthScene_b(aeroplane)
        }else{
            scene.dispose()
            scene=forthScene_d(aeroplane)
        }        
    })
    advancedTexture_l2.addControl(panel_l2)}

function aerofly_d(aeroplane){
    let temp_pos
    const radar=new BABYLON.Vector3(257,15,98)
    console.log(radar)
    if(aeroplane.position.z==0&&aeroplane.position.x<600){
        let back=0
        setTimeout(()=>{
                back=setInterval(()=>{
                temp_pos=new BABYLON.Vector3(aeroplane.position.x,aeroplane.position.y,aeroplane.position.z)
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
            createBackSphere(scene,temp_pos,radar)
            if(aeroplane.position.z<=-600){
                clearInterval(move)
            }
        },5)
    }
}


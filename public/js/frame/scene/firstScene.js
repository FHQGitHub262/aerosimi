var firstScene = function () {
    var scene = new BABYLON.Scene(engine);

    video=""
    type="side"

    var assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.onTaskError = function (task) {
        console.log("error while loading " + task.name);
    }
    addRadar(assetsManager,new BABYLON.Vector3(260,-10,-100))
    engine.loadingUIBackgroundColor = "Black";
    assetsManager.load();

    var light = setLight(scene)
    var camera = radarCam(scene)
    var ground = frameGround(scene)
    addRadarPanel(assetsManager)

    var tri_panel = addBackButton("电磁辐射")

    scene.onPointerDown = function () {
        scene.onPointerDown = undefined
        camera.attachControl(canvas, true);
    }

    var vrHelper = vr(scene,ground)
    return scene;
};

function addRadarPanel(){
    let columns = [
        "433MHz",
        "2.4GHz"
    ]
    let wave=""
    
    let 
}

function addRadarPanel() {
    let frequency = "NaN"
    let columns = [
        "433MHz",
        "2.4GHz"
    ]
    let wave=""

    var plane_r = BABYLON.Mesh.CreatePlane("plane", 40);
    plane_r.position.x = 290;
    plane_r.position.y = 100
    plane_r.position.z = 60
    plane_r.billboardMode=2
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane_r);

    let panel=downFormitem(columns,title="开始实验",subtitle="设定雷达参数",onRatioClick=(value)=>{
        if(value==columns[0])
            frequency="433MHz"
        else
            frequency=0.7    
    },onButtonClick=()=>{
        if(frequency=="433MHz")
            wave=createRadarSphere(scene,2,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
        else
            wave=createRadarSphere(scene,0.6,new BABYLON.Vector3(257,15,-98),new BABYLON.Vector3(Math.PI*0.3,Math.PI*0.69,Math.PI*0))
        setTimeout(()=>{
            clearInterval(wave)
        },10000)
    })
    advancedTexture.addControl(panel)
}


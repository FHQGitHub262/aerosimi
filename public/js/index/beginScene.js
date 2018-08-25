function addButton(scene){
    var anchor = new BABYLON.TransformNode("");
}

function setLight(scene){
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light
}

function setSky(scene) {
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:5000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay/TropicalSunnyDay", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.disableLighting = true;
	skybox.material = skyboxMaterial;			
    return skybox
}

function createGround(scene){
    var groundTexture = new BABYLON.Texture("textures/sand.jpg", scene);
	groundTexture.vScale = groundTexture.uScale = 4.0;
	
	var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
	groundMaterial.diffuseTexture = groundTexture;
	
	var ground = BABYLON.Mesh.CreateGround("ground", 4000, 4000, 5, scene, false);
	ground.position.y = -10;
	ground.material = groundMaterial;
    return ground
}

function createWater(scene){
    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 4000, 4000, 10, scene, false);
	var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(1024, 1024));
	water.backFaceCulling = true;
	water.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);
	water.windForce = 5;
	water.waveHeight = 0.5;
	water.bumpHeight = 0.1;
	water.waveLength = 0.1;
	water.colorBlendFactor = 0;

    for(let i=1;i<arguments.length;i++){
        water.addToRenderList(arguments[i])
    }

	waterMesh.material = water;
    waterMesh.position.y=-10
    return waterMesh
}

function setCamera(scene){
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, false, false);
    return camera
}

function createPanel(){
    let next=""
    let columns=[
        "电磁波特性",
        "飞行器散射",
        "与时间相关",
        "PCS"
    ]
    // Plane
    var plane = BABYLON.Mesh.CreatePlane("plane", 20);
    plane.position.z = 25;
    plane.position.y=3

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

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
    button1.onPointerClickObservable.add(()=>{
        switch(next){
            case columns[0]:
                scene=firstScene()
                break
            case columns[1]:
                scene=firstScene()
                break
            case columns[2]:
                scene=firstScene()
                break
            case columns[3]:
                scene=firstScene()
                break
            default:
                textblock.text="请先选中实验再开始"
        }
    })

    var textblock = new BABYLON.GUI.TextBlock();
    textblock.height = "150px";
    textblock.fontSize = 100;
    textblock.text = "请选择一个实验:";
    panel.addControl(textblock);   

    var addRadio = function(text, parent) {
        var button = new BABYLON.GUI.RadioButton();
        button.width = "40px";
        button.height = "40px";
        button.color = "white";
        button.background = "orange";     

        button.onIsCheckedChangedObservable.add(function(state) {
            if (state) {
                textblock.text = "已选中：" + text;
                next=text
            }
        }); 

        var header = BABYLON.GUI.Control.AddHeader(button, text, "400px", { isHorizontal: true, controlFirst: true });
        header.height = "150px";
        header.children[1].fontSize = 60;
        header.children[1].onPointerDownObservable.add(function() {
            button.isChecked = !button.isChecked;
        });

        parent.addControl(header);    
    }

    columns.forEach(element => {
        addRadio(element,panel)
    });
}

var beginScene = function () {
    var scene = new BABYLON.Scene(engine);

    var sky=setSky(scene)
    var light=setLight(scene)
    var camera=setCamera(scene)
    var ground=createGround(scene)
    var water=createWater(scene,sky,ground)
    var panel=createPanel(scene)

    scene.onPointerDown = function () {
        scene.onPointerDown = undefined
        camera.attachControl(canvas, true);
    }

    var vrHelper = scene.createDefaultVRExperience();
    vrHelper.enableTeleportation({floorMeshes: [ground]});
    vrHelper.displayGaze=true
    vrHelper.displayLaserPointer=true
    vrHelper.enableInteractions();
    return scene;
};
// function createPanel(scene){
//     let columns=[
//         "电磁波特性",
//         "飞行器散射",
//         "与时间相关",
//         "PCS"
//     ]
//     var anchor = new BABYLON.TransformNode("");
//     var manager = new BABYLON.GUI.GUI3DManager(scene);

//     var panel = new BABYLON.GUI.CylinderPanel();
//     panel.margin = 0.5;
//     panel.radius=4
//     panel.columns=4

//     manager.addControl(panel);
//     panel.linkToTransformNode(anchor);

//     var pushButtonCore;
//     var index = 0; 

//     BABYLON.SceneLoader.ImportMesh("", "./mesh/", "pushButton.glb", scene, function (newMeshes) {
//         pushButtonCore = newMeshes[0];
//         makePushButtons();
//         pushButtonCore.setEnabled(false);
//     });

//     function makePushButton(mesh, hoverColor) {
//         var cylinder = mesh.getChildMeshes(false, (node) => { return node.name.indexOf("Cylinder") !== -1 })[0];
//         var cylinderMat = cylinder.material.clone();
//         cylinderMat.albedoColor = new BABYLON.Color3(0.5, 0.19, 0);
//         cylinder.material = cylinderMat;
//         var pushButton = new BABYLON.GUI.MeshButton3D(mesh, "pushButton" + index);
//         pushButton.pointerEnterAnimation = () => {
//             cylinder.material.albedoColor = hoverColor;
//         };
//         pushButton.pointerOutAnimation = () => {
//              cylinder.material.albedoColor = new BABYLON.Color3(0.5, 0.19, 0);
//         };
//         pushButton.pointerDownAnimation = () => {
//             cylinder.position.y = 0;
//         }
//         pushButton.pointerUpAnimation = () => {
//             cylinder.position.y = 0.21;
//         }
//         pushButton.onPointerDownObservable.add(() => {
//             console.log(pushButton.name + " pushed.");
//         });
//         panel.addControl(pushButton);
//         index++;
//     }

//     function makePushButtons() {
//         var color;
//         var newPushButton;
//         var colors = [{r: 0.25, g:0, b:0}, {r: 0, g:0.25, b:0}, {r: 0, g:0, b:0.25},
//                       {r: 0.25, g:0.25, b:0}, {r: 0, g:0.25, b:0.25}, {r: 0.25, g:0, b:0.25}];

//         panel.blockLayout = true;
//         for (var i = 0; i < 4; i++) {
//             newPushButton = pushButtonCore.clone("pushButton" + index);
//             color = new BABYLON.Color3(colors[i % 6].r, colors[i % 6].g, colors[i % 6].b);
//             makePushButton(newPushButton, color);
//         }
//         panel.blockLayout = false;
//     }
// // -------------------------------
//     // var addButton = function(text) {
//     //     var button = new BABYLON.GUI.HolographicButton("orientation");
//     //     button.w=10
//     //     // button.scaling=new BABYLON.Vector3(5,5,5)
//     //     panel.addControl(button);

//     //     button.text = text;
//     //     return button
//     // }

//     // panel.blockLayout = true;
//     // columns.forEach(element => {
//     //     addButton(element)
//     // });
//     // panel.blockLayout = false;
// }

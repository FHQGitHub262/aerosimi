var simpleScene=function(){
    let scene = new BABYLON.Scene(engine);
    setLight(scene)
    setCamera(scene)
    
    // scene.createDefaultCameraOrLight(true, true, true);
    
    var groundTexture = new BABYLON.Texture("textures/grid12.png", scene);
    groundTexture.vScale = groundTexture.uScale = 20.0;

    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;

    var ground = BABYLON.Mesh.CreateGround("ground", 4000, 4000, 1, scene, false);
    // ground.position.y = -10;
    ground.material = groundMaterial;

	return scene;
}
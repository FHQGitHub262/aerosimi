function addCloseButton(screen) {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var button = BABYLON.GUI.Button.CreateSimpleButton("close", "close");
    button.alpha = 0.5
    button.width = "74px";
    button.height = "50px";
    button.color = "white";
    button.background = "gray";

    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    advancedTexture.addControl(button);

    button.onPointerClickObservable.add(function () {
        screen.dispose()
        advancedTexture.dispose()
        video = ""
    })
}

function addBackButton(title) {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var button = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/backspace.png");
    button.alpha = 0.5
    button.width = "74px";
    button.height = "50px";
    button.color = "#333";
    button.background = "white";
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    advancedTexture.addControl(button);

    button.onPointerClickObservable.add(function () {
        scene.dispose()
        scene = simpleScene()
    })

    header = new BABYLON.GUI.TextBlock();
    header.text = title;
    header.height = "40px";
    header.color = "white";
    header.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    header.paddingLeft = "100px";
    header.paddingTop = "10px";
    advancedTexture.addControl(header)
}

function addVideo(type = "side", url = getVideoUrl()) {
    var screen = BABYLON.MeshBuilder.CreatePlane("screen", {
        height: 90 / 3,
        width: 160 / 3
    }, scene)
    screen.billboardMode = 7
    screen.scaling = new BABYLON.Vector3(2, 2, 2)
    if (type == "front") {
        screen.position.y = 80
        screen.position.x = 0
        screen.position.z = -300
    } else if (type == "side") {
        screen.position.y = 80
        screen.position.x = 300
        screen.position.z = 0
    }
    var mat = new BABYLON.StandardMaterial("mat", scene);

    var videoTexture = new BABYLON.VideoTexture("video", [url], scene, true, false);
    videoTexture.invertZ = false

    mat.diffuseTexture = videoTexture;
    screen.material = mat;
    videoTexture.video.play();

    addCloseButton(screen)

    return screen
}

function addPicture(type = "side", url = getPictureUrl()) {
    var screen = BABYLON.MeshBuilder.CreatePlane("screen", {
        height: 90 / 3,
        width: 160 / 3
    }, scene)
    screen.billboardMode = 7
    screen.scaling = new BABYLON.Vector3(2, 2, 2)
    if (type == "front") {
        screen.position.y = 80
        screen.position.x = 0
        screen.position.z = -300
        // screen.rotation.x=0.5
    } else if (type == "side") {
        screen.position.y = 80
        screen.position.x = 300
        screen.position.z = 0
        // screen.rotation.x=0.5    
    }
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = new BABYLON.Texture(url, scene);
    screen.material = mat;
    addCloseButton(screen)
    return screen
}
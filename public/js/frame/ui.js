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

    let logo = new BABYLON.GUI.Image("logo", "textures/logo.png");
    logo.stretch=BABYLON.GUI.Image.STRETCH_NONE
    logo.verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    logo.horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    logo.height = "60px";
    logo.width="240px"
    advancedTexture.addControl(logo);    

    let lab=new BABYLON.GUI.TextBlock()
    lab.text="国家级实验教学示范中心\n国家级虚拟仿真实验教学中心"
    lab.fontFamily="sans serf"
    // lab.fontColor = new BABYLON.Color3(42/255,104/255,222/255);
    lab.color="darkblue"
    lab.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    lab.textVerticalAlignment=transformVertical("bottom")
    lab.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    lab.paddingLeft = "260px";
    lab.top = "-10px";
    lab.lineSpacing="2px"
    advancedTexture.addControl(lab)

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
    let scaling=3
    var screen = BABYLON.MeshBuilder.CreatePlane("screen", {
        height: 90 / scaling,
        width: 160 / scaling
    }, scene)
    screen.billboardMode = 7
    screen.scaling = new BABYLON.Vector3(2, 2, 2)
    if (type == "front") {
        screen.position.y = 80
        screen.position.x = 50
        screen.position.z = -300
        // screen.rotation.x=0.5
    } else if (type == "side") {
        screen.position.y = 80
        screen.position.x = 300
        screen.position.z = 0
        // screen.position.z=50
    }
    // console.log(BABYLON.ActionManager)
    // screen.actionManager = new BABYLON.ActionManager(scene);
    // screen.actionManager.registerAction(
    //     new BABYLON.InterpolateValueAction(
    //         BABYLON.ActionManager.OnPickTrigger,
    //         screen,
    //         'position',
    //         new BABYLON.Vector3(300,0,50),
    //         1
    //     )
    // )        
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = new BABYLON.Texture(url, scene);
    screen.material = mat;
    addCloseButton(screen)
    return screen
}

function Button(text,onButtonClick=()=>{
    console.log("click")
},onButtonHover=()=>{
    console.log("hover")
},height="100px",width=1,color="white",background="orange",fontSize=50){
    let button = BABYLON.GUI.Button.CreateSimpleButton(text, text);
    button.width = width;
    button.height = height
    button.color = color;
    button.fontSize = fontSize
    button.background = background;
    button.onPointerClickObservable.add(onButtonClick)
    button.onPointerMoveObservable.add(onButtonHover)
    return button
}

function Button_s(text,onButtonClick=()=>{
    console.log("click")
},onButtonHover=()=>{
    console.log("hover")
},height="100px",width=1,color="white",background="orange",fontSize=50,){
    let button = BABYLON.GUI.Button.CreateSimpleButton(text, text);
    button.width = "200px";
    button.height = "40px"
    button.color = color;
    button.fontSize = 20
    button.background = background;
    button.onPointerClickObservable.add(onButtonClick)
    button.onPointerMoveObservable.add(onButtonHover)
    return button
}

function TextBlock(text,fontSize=70,height="150px"){
    var textblock = new BABYLON.GUI.TextBlock();
    textblock.height = height;
    textblock.fontSize = fontSize;
    textblock.text = text;
    textblock.color = "black"
    textblock.alpha = 0.7
    return textblock
}

function RatioButton(size="40px"){
    let button = new BABYLON.GUI.RadioButton();
    button.width = size;
    button.height = size;
    button.color = "white";
    button.background = "orange";
    return button
}

function Ratio(text,height="150px",width="400px",fontsize=40,size="40px",callback=(value)=>{
    console.log(value)
}){
    let button = RatioButton(size)
    button.onIsCheckedChangedObservable.add((state)=>{
        if(state){
            callback(text)
        }
    })
    let header = BABYLON.GUI.Control.AddHeader(button, text, width, {
        isHorizontal: true,
        controlFirst: true
    });
    header.height = height;
    header.color = "black"
    header.alpha = 0.7
    header.children[1].fontSize=36
    header.children[1].onPointerMoveObservable.add(()=>{
        header.children[1].fontSize=44
    })
    header.children[1].onPointerOutObservable.add(()=>{
        header.children[1].fontSize=36        
    })
    header.children[1].fontSize = fontsize;
    header.children[1].onPointerDownObservable.add(()=>{
        button.isChecked = !button.isChecked;
    });
    return header
}

function Ratio_s(text,height="150px",width="400px",fontsize=40,size="40px",callback=(value)=>{
    console.log(value)
}){
    let button = RatioButton(size)
    button.onIsCheckedChangedObservable.add((state)=>{
        if(state){
            callback(text)
        }
    })
    let header = BABYLON.GUI.Control.AddHeader(button, text, width, {
        isHorizontal: true,
        controlFirst: true
    });
    header.height = height;
    header.color = "black"
    header.alpha = 0.7
    header.children[1].fontSize=20
    header.children[1].onPointerMoveObservable.add(()=>{
        header.children[1].fontSize=24
    })
    header.children[1].onPointerOutObservable.add(()=>{
        header.children[1].fontSize=20        
    })
    header.children[1].fontSize = fontsize;
    header.children[1].onPointerDownObservable.add(()=>{
        button.isChecked = !button.isChecked;
    });
    return header
}

// button在上方
function upFormitem(columns,title,onRatioClick=(value)=>{
    console.log(value)
},onButtonClick=()=>{
    console.log("click")
}){
    let panel = new BABYLON.GUI.StackPanel();
    panel.top = "100px";
    panel.background = "white"
    panel.alpha = 0.8
    
    panel.addControl(Button(title,onButtonClick=onButtonClick))

    columns.forEach((element)=>{
        panel.addControl(Ratio(element,height="150px",width="400px",fontsize=40,size="40px",onRatioClick))
    })
    return panel
}

// button在下方
function downFormitem(columns,title,subtitle,onRatioClick=(value)=>{
    console.log(value)
},onButtonClick=()=>{
    console.log("click")
}){
    let panel = new BABYLON.GUI.StackPanel();
    panel.top = "100px";
    panel.background = "white"
    panel.alpha = 0.8
    
    let textblock=TextBlock(subtitle)
    panel.addControl(textblock)

    columns.forEach((element)=>{
        panel.addControl(Ratio(element,height="150px",width="400px",fontsize=40,size="40px",(value)=>{
            onRatioClick()
            textblock.text=`已选择：${value}`
        }))
    })

    panel.addControl(Button(title,onButtonClick=onButtonClick))
    return panel
}

function downFormitem_s(columns,title,subtitle,left,top,horizontal,vertical,onRatioClick=(value)=>{
    console.log(value)
},onButtonClick=(value)=>{
    console.log("click")
}){
    let panel = new BABYLON.GUI.StackPanel();
    panel.width="150px"
    panel.height="140px"
    panel.horizontalAlignment = transformHorizontal(horizontal);
    panel.verticalAlignment = transformVertical(vertical)
    panel.background="white"
    panel.alpha=0.8
    panel.top=top
    panel.left=left
    
    let textblock=TextBlock(subtitle,20,"30px")
    panel.addControl(textblock)

    columns.forEach((element)=>{
        panel.addControl(Ratio_s(element,height="35px","100px",fontsize=15,size="15px",(value)=>{
            onRatioClick(value)
            textblock.text=`已选择：${value}`
        }))
    })

    panel.addControl(Button_s(title,onButtonClick=onButtonClick))
    return panel
}

// 没有button
function pureFormitem(columns,subtitle,left,top,horizontal,vertical,onRatioClick=(value)=>{
    console.log(value)
},onButtonClick=()=>{
    console.log("click")
}){
    let panel = new BABYLON.GUI.StackPanel();
    panel.width="200px"
    panel.height="200px"
    panel.horizontalAlignment = transformHorizontal(horizontal);
    panel.verticalAlignment = transformVertical(vertical)
    panel.background="white"
    panel.alpha=0.8
    panel.top=top
    panel.left=left

    let textblock=TextBlock(subtitle,25,"40px")
    panel.addControl(textblock)

    columns.forEach((element)=>{
        panel.addControl(Ratio_s(element,height="75px","100px",fontsize=20,size="20px",(value)=>{
            onRatioClick(value)
            textblock.text=`已选择：${value}`
        }))
    })
    return panel
}

//角落里的pureformitem，极小
function miniFormitem(columns,subtitle,left,top,horizontal,vertical,onRatioClick=(value)=>{
    console.log(value)
},onButtonClick=()=>{
    console.log("click")
}){
    let panel = new BABYLON.GUI.StackPanel();
    panel.width="150px"
    panel.height="100px"
    panel.horizontalAlignment = transformHorizontal(horizontal);
    panel.verticalAlignment = transformVertical(vertical)
    panel.background="white"
    panel.alpha=0.8
    panel.top=top
    panel.left=left

    let textblock=TextBlock(subtitle,20,"30px")
    panel.addControl(textblock)

    columns.forEach((element)=>{
        panel.addControl(Ratio_s(element,height="35px","100px",fontsize=15,size="15px",(value)=>{
            onRatioClick(value)
            textblock.text=`已选择：${value}`
        }))
    })
    return panel
}

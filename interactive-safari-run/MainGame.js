import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;


  const fov = 45;
  const aspect = 2; 
  const near = 0.01;
  const far = 10000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(290, 155,0);
  camera.lookAt(0, 95, 0);

  const loader = new THREE.TextureLoader();
  const scene = new THREE.Scene();
  scene.background = loader.load('grass.jpg');

  var platform = new THREE.BoxGeometry(500,250,250);

  var text = loader.load('sand.jpg');
  text.wrapS = THREE.RepeatWrapping;
  text.wrapT = THREE.RepeatWrapping;
  var ground = new THREE.MeshBasicMaterial({map : text});
  text.mesh = new THREE.Mesh(platform, ground);
  scene.add(text.mesh);

  var sky = new THREE.BoxGeometry(1350, 500, 40);
  var materialsky = new THREE.MeshBasicMaterial({color: 'rgb(135,206,250)'});
  //text_sky.color.set('rgb(135,206,250)');
  var skytextured = new THREE.Mesh(sky, materialsky);
  skytextured.position.set(-500, 357, 0);
  skytextured.rotation.y = (Math.PI/2);
  scene.add(skytextured);
  //-500, 250, 0


  const axesHelper = new THREE.AxesHelper( 300 );
  scene.add( axesHelper );
  // x rosso
  // y verde
  // z blu

  var ball_x =  230.77777570244587;
  var ball_y = 130.80795482069422; 
  var ball_z = 0;

  var life_count = 3;
  var num_pika = 0;
  var num_ball = 0;
  var num_mimi = 0;

  var points_count = 0;

  var game_started = false;
  var game_ended = false;

  var velocity;
  var spawn_vel;


  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 0.8;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    //light.position.set(230, 130, 0);
    //690, 700, 0
    console.log(light.position);
    scene.add(light);
/*const targetObject = new THREE.Object3D();
    targetObject.position.set(0, 130, 0);
    scene.add(targetObject);

    light.target = targetObject;

    scene.add(new THREE.CameraHelper( light.shadow.camera ));
    light.castShadow = true;
    light.shadowDarkness = 0.5;
    light.shadowCameraVisible = true;
     */
    

  }
  

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    light.castShadow = true;
    scene.add(light);
    scene.add(light.target);
  }


  function renderObjectGltf(url, X, Y, Z, s1, s2, s3){
    var objecttoload = new THREE.Scene(); 
    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(url, (gltf) => {
      objecttoload.add(gltf.scene);
      objecttoload.position.set(X, Y, Z);
      objecttoload.scale.set(s1, s2, s3);

      if(url==='./pokeball/scene.gltf'){
        objecttoload.rotation.y = (-Math.PI/2);
        objecttoload.name = "pokeball";

      }

      scene.add(objecttoload);

      const tweenup = new TWEEN.Tween({ x: X, y: Y, z:Z}).to({x: X, y: Y+0.15, z: Z}, 2500).easing(TWEEN.Easing.Quadratic.InOut);
      const tweendown = new TWEEN.Tween({ x: X, y: Y+0.15, z: Z}).to({x: X, y: Y, z: Z}, 2500).easing(TWEEN.Easing.Quadratic.InOut);

      tweenup.onUpdate(function (object) {
        objecttoload.position.set(object.x, object.y, object.z)
      });
      tweendown.onUpdate(function (object) {
        objecttoload.position.set(object.x, object.y, object.z)
      });

      tweenup.chain(tweendown);
      tweendown.chain(tweenup);
      
      tweenup.start();

     });
    }
  }

  function renderPikachuGltf(url, X, Y, Z, s1, s2, s3, id){
    var objecttoload = new THREE.Scene(); 
    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(url, (gltf) => {
      objecttoload.add(gltf.scene);
      objecttoload.position.set(X, Y, Z);
      objecttoload.scale.set(s1, s2, s3);

      if(url==='./pikachu/scene.gltf'){
        objecttoload.rotation.y = (Math.PI/2);
        objecttoload.name = "pikachu"+ id;

      }

      scene.add(objecttoload);

      const tweenmove = new TWEEN.Tween({x: X, y: Y, z: Z}).to({x: ball_x+5 , y: Y , z:Z}, velocity); //velocity previously 10000

      tweenmove.onUpdate(function (object) {
        objecttoload.position.set(object.x, object.y, object.z)
      });
      
      tweenmove.start();

     });
    }
  }

  function renderMimiGltf(url, X, Y, Z, s1, s2, s3, id){
    var objecttoload = new THREE.Scene(); 
    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(url, (gltf) => {
      objecttoload.add(gltf.scene);
      objecttoload.position.set(X, Y, Z);
      objecttoload.scale.set(s1, s2, s3);

      if(url==='./mimikyu/scene.gltf'){
        objecttoload.rotation.y = (Math.PI/2);
        objecttoload.name = "mimi"+ id;

      }

      scene.add(objecttoload);

      const tweenmove = new TWEEN.Tween({x: X, y: Y, z: Z}).to({x: ball_x+5 , y: Y , z:Z}, velocity); //velocity previously 10000

      tweenmove.onUpdate(function (object) {
        objecttoload.position.set(object.x, object.y, object.z)
      });
      
      tweenmove.start();

     });
    }
  }

  function renderCloudGltf(url, X, Y, Z, s1, s2, s3){
    var objecttoload = new THREE.Scene(); 
    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(url, (gltf) => {
      objecttoload.add(gltf.scene);
      objecttoload.position.set(X, Y, Z);
      objecttoload.scale.set(s1, s2, s3);
      objecttoload.rotation.y = (Math.PI/2);

      scene.add(objecttoload);

     });
    }
  }
  
  function renderBallGltf(url, X, Y, Z, s1, s2, s3, id){
    var objecttoload = new THREE.Scene(); 
    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(url, (gltf) => {
      objecttoload.add(gltf.scene);
      objecttoload.position.set(X, Y, Z);
      objecttoload.scale.set(s1, s2, s3);
      objecttoload.name = "ball" + id;
      objecttoload.rotation.y = (Math.PI/2);

      scene.add(objecttoload);

      const tweenmove = new TWEEN.Tween({x: X, y: Y, z: Z}).to({x: ball_x+5 , y: Y , z:Z}, velocity).onUpdate(function (object) { //velocity 10000
        objecttoload.position.set(object.x, object.y, object.z);
        
      });;
      
      tweenmove.start();
      
     });
    }
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  
   function setupKeyControls() {
    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 39: //ArrowRight
        if((ball_z)>-125){
          //const tweenright = new TWEEN.Tween({x: scene.getObjectByName("pokeball").position.x, y: scene.getObjectByName("pokeball").position.y, z:scene.getObjectByName("pokeball").position.z}).to({x: scene.getObjectByName("pokeball").position.x, y: scene.getObjectByName("pokeball").position.y, z:scene.getObjectByName("pokeball").position.z-3}, 4000);
          //tweenright.onUpdate(function (ball) {
          //ball.position.set(scene.getObjectByName("pokeball").position.x, scene.getObjectByName("pokeball").position.y, scene.getObjectByName("pokeball").position.z-3);
          //});
          //tweenright.start();
          
          //scene.getObjectByName("pokeball").position.z -= 3;
          //camera.position.z += 3;
          ball_z -= 1.5;
          renderPokeball();
          //console.log(scene.getObjectByName("pokeball").position.z);
        }
        break;
        case 37: //ArrowLeft
        if((ball_z)<125){
          //const tweenleft = new TWEEN.Tween({x: scene.getObjectByName("pokeball").position.x, y: scene.getObjectByName("pokeball").position.y, z:scene.getObjectByName("pokeball").position.z}).to({x: scene.getObjectByName("pokeball").position.x, y: scene.getObjectByName("pokeball").position.y, z:scene.getObjectByName("pokeball").position.z+3}, 500);
          //tweenleft.onUpdate(function (object) {
            //scene.getObjectByName("pokeball").position.set(object.x, object.y, object.z)
          //});
          //tweenleft.start();
          //scene.getObjectByName("pokeball").position.set(scene.getObjectByName("pokeball").position.x, scene.getObjectByName("pokeball").position.y, scene.getObjectByName("pokeball").position.z+3);
          
          //scene.getObjectByName("pokeball").position.z += 3;
          //camera.position.z += 3;


          ball_z += 1.5;
          renderPokeball();
        }
        break; 

        case 82: //R
        if(life_count<0 || game_ended){
          window.location.reload();
        }
        break;

        case 69: //E easy
        if(!game_started){
          game_started = true;
          game_ended = false;
          spawn_vel = 6000;
          velocity = 12000;
          scene.traverse(function(node){
            scene.remove(scene.getObjectByName("title"));
        });
        }
        document.getElementById("info").style.display = 'none';
        document.getElementById("rules").style.display = 'none';
        document.getElementById("rules2").style.display = 'none';
        document.getElementById("commands1").style.display = 'none';
        document.getElementById("left").style.display = 'none';
        document.getElementById("right").style.display = 'none';
        document.getElementById("Play").style.display = 'none';

        document.getElementById("points").style.display = 'block';
        document.getElementById("life").style.display = 'block';
        document.getElementById("pointscount").style.display = 'block';
        document.getElementById("lifecount").style.display = 'block';

        document.getElementById("pointscount").innerHTML = points_count;
        document.getElementById("lifecount").innerHTML = life_count;
          spawnLoop();
          
        break;

        case 77: //M medium
        if(!game_started){
          game_started = true;
          game_ended = false;
          spawn_vel = 5000;
          velocity = 10000;
          scene.traverse(function(node){
            scene.remove(scene.getObjectByName("title"));
        });
        }
        document.getElementById("info").style.display = 'none';
        document.getElementById("rules").style.display = 'none';
        document.getElementById("rules2").style.display = 'none';
        document.getElementById("commands1").style.display = 'none';
        document.getElementById("left").style.display = 'none';
        document.getElementById("right").style.display = 'none';
        document.getElementById("Play").style.display = 'none';

        document.getElementById("points").style.display = 'block';
        document.getElementById("life").style.display = 'block';
        document.getElementById("pointscount").style.display = 'block';
        document.getElementById("lifecount").style.display = 'block';

        document.getElementById("pointscount").innerHTML = points_count;
        document.getElementById("lifecount").innerHTML = life_count;
          spawnLoop();
          
        break;

        case 72: //H hard
        if(!game_started){
          game_started = true;
          game_ended = false;
          spawn_vel = 4000;
          velocity = 8000;
          scene.traverse(function(node){
            scene.remove(scene.getObjectByName("title"));
        });
        }
        document.getElementById("info").style.display = 'none';
        document.getElementById("rules").style.display = 'none';
        document.getElementById("rules2").style.display = 'none';
        document.getElementById("commands1").style.display = 'none';
        document.getElementById("left").style.display = 'none';
        document.getElementById("right").style.display = 'none';
        document.getElementById("Play").style.display = 'none';

        document.getElementById("points").style.display = 'block';
        document.getElementById("life").style.display = 'block';
        document.getElementById("pointscount").style.display = 'block';
        document.getElementById("lifecount").style.display = 'block';

        document.getElementById("pointscount").innerHTML = points_count;
        document.getElementById("lifecount").innerHTML = life_count;
          spawnLoop();
          
        break;
      }
    };
  }  

  function randomPosition(){ //random position on z axis for the spawn of pikachu, ball or mimikyu
    return Math.floor(Math.random() * (60 + 70 + 1) - 70);
  }

  function init(){
    renderObjectGltf('./pokeball/scene.gltf', ball_x, ball_y, ball_z, 4, 4, 4);
    renderCloudGltf('./cloud/scene.gltf', -200, 200, 50, 5, 5, 5);
    renderCloudGltf('./cloud/scene.gltf', -200, 150, -30, 8, 8, 8);
    renderCloudGltf('./sun/scene.gltf', -205, 165, -30, 0.1, 0.1, 0.1);
    renderCloudGltf('./cloud/scene.gltf', -200, 200, 100, 10, 10, 10);
    renderCloudGltf('./cloud/scene.gltf', -200, 200, 400, 10, 10, 10);
    renderCloudGltf('./cloud/scene.gltf', -200, 150, 200, 6, 6, 6);
    renderCloudGltf('./cloud/scene.gltf', -200, 200, -100, 10, 10, 10);
    renderCloudGltf('./cloud/scene.gltf', -200, 160, -300, 7, 7, 7);

    //welcome menu
    //title
    var loader = new THREE.FontLoader();

        loader.load( 'fonts/optimer_bold.typeface.json', function ( font ) {

        var title_text = new THREE.TextGeometry( "Pikachu Safari Run", {

        font: font,

        size: 25,
        height: 5,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 2,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: "rgb(9, 15, 113)" } );

    var x =  0;
    var y = 170; 
    var z = 140;

    var mesh = new THREE.Mesh( title_text, textMaterial );
    mesh.position.set( x, y, z );
    mesh.rotation.y = (Math.PI/2);
    mesh.name = "title";

    scene.add( mesh );

} );
    
    scene.traverse(function(node){
      if(node.geometry){
          node.geometry.computeBoundingBox();
      }
  });
  document.getElementById("points").style.display = 'none';
  document.getElementById("life").style.display = 'none';
  document.getElementById("pointscount").style.display = 'none';
  document.getElementById("lifecount").style.display = 'none';

  }

  function renderPokeball(){
    renderObjectGltf('./pokeball/scene.gltf', ball_x, ball_y, ball_z, 4, 4, 4);
    if(scene.getObjectByName("pokeball")!=  null){
      scene.remove(scene.getObjectByName("pokeball"));
    }
  }
  
  function what_object(){
    return Math.round(Math.random());
  }

  function onCompleteBall(posz, id){
    console.log("oncomplete chiamata");
      if(posz <= ball_z+5 && posz >= ball_z-5){
        life_count++;
        console.log(life_count);
        document.getElementById("lifecount").innerHTML = life_count;
      }
    scene.remove(scene.getObjectByName("ball" + id));
    }
  
    function onCompletePika( posz, id){
      console.log("oncomplete chiamata");
        if(posz <= ball_z+5 && posz >= ball_z-5){
          life_count--;
          points_count++;
          console.log(life_count);
          console.log(points_count);
          document.getElementById("pointscount").innerHTML = points_count;
          document.getElementById("lifecount").innerHTML = life_count;
        }
        scene.remove(scene.getObjectByName("pikachu" + id));
      }
    
      function onCompleteMimi( posz, id){
        console.log("oncomplete chiamata");
          if(posz <= ball_z+5 && posz >= ball_z-5){
            life_count = -1;
          }
          console.log(scene.getObjectByName("mimi" + id).position);
          scene.remove(scene.getObjectByName("mimi" + id));
        }

  function spawnObject(rand, id){
    if( id== 0){
      renderBallGltf('./pokeball1/scene.gltf', -250, 129, rand, 0.02, 0.02, 0.02, num_ball);
      setTimeout(onCompleteBall, velocity + 1, rand, num_ball);
      num_ball++;

    } else {
      if(what_object()==0){
        renderMimiGltf('./mimikyu/scene.gltf', -250, 125, rand, 0.15, 0.15, 0.15, num_mimi);
        setTimeout(onCompleteMimi, velocity + 1, rand, num_mimi);
        num_mimi++;
      } else {
        renderPikachuGltf('./pikachu/scene.gltf', -250, 125, rand, 1.5, 1.5, 1.5, num_pika);
      setTimeout(onCompletePika, velocity + 1, rand, num_pika);
      num_pika++;
      }
      
    }

  }

  function removePikachus(){
    var rem_pika = num_pika;
    while(scene.getObjectByName("pikachu"+rem_pika)!= null){
      scene.remove(scene.getObjectByName("pikachu"+rem_pika));
      rem_pika--;
    }
  }

  function removeBalls(){
    var rem_ball = num_ball;
    while(scene.getObjectByName("ball"+rem_ball)!= null){
      scene.remove(scene.getObjectByName("ball"+rem_ball));
      rem_ball--;
    }
  }

  function removeMimi(){
    var rem_mimi = num_mimi;
    while(scene.getObjectByName("mimi"+rem_mimi)!= null){
      scene.remove(scene.getObjectByName("mimi"+rem_mimi));
      rem_mimi--;
    }
  }

  function animate() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    TWEEN.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  setupKeyControls();
  requestAnimationFrame(animate);
  init();
  
  var i = 1;                  

  function spawnLoop() {         
    setTimeout(function() {   
      setTimeout(spawnObject, spawn_vel, randomPosition(), what_object()); //spawn_vel previously 5000
      i++;  

      if (life_count<0){
        var points = points_count;
        document.getElementById("finalscore2").innerHTML = points;
        removePikachus();
        removeBalls();
        removeMimi();
        game_started = false;

        var loader = new THREE.FontLoader();

        loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {

        var gameover_text = new THREE.TextGeometry( "G A M E \nO V E R !", {

        font: font,

        size: 25,
        height: 5,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 2,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: "rgb(9, 15, 113)" } );

    var x =  0;
    var y = 170; 
    var z = 70;

    var mesh = new THREE.Mesh( gameover_text, textMaterial );
    mesh.position.set( x, y, z );
    mesh.rotation.y = (Math.PI/2);

    scene.add( mesh );

} );

  document.getElementById("Restart").style.display = 'block';
  document.getElementById("finalscore").style.display = 'block';
  document.getElementById("finalscore2").style.display = 'block';
  document.getElementById("points").style.display = 'none';
  document.getElementById("life").style.display = 'none';
  document.getElementById("pointscount").style.display = 'none';
  document.getElementById("lifecount").style.display = 'none';
      }

      if (i < 30 && life_count>=0) {           
        spawnLoop();
      }}, spawn_vel)
if(i == 29){
  game_ended = true;
  document.getElementById("finalscore2").innerHTML = points_count;
  document.getElementById("Restart").style.display = 'block';
  document.getElementById("finalscore").style.display = 'block';
  document.getElementById("finalscore2").style.display = 'block';
  document.getElementById("points").style.display = 'none';
  document.getElementById("life").style.display = 'none';
  document.getElementById("pointscount").style.display = 'none';
  document.getElementById("lifecount").style.display = 'none';
}
  } 
}

main();


/* COSE DA FARE ALLA FINE
-riordinare tutte le variabili dei punti e vite in alto ----------- FATTO MA RIFARE ALLA FINE ---------------

VENERDI 17 SETTEMBRE:
-grafica con tween della pokeball


-REPORT IMPORTANTE

-QUANDO UPLOAD SU GIT MANDARE MAIL AL PROF!! 



*/

import React from 'react';
import { useState, useMemo } from 'react';
import './App.css';

import * as THREE from 'three';
import { Canvas, useLoader, useFrame} from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from '@react-three/drei';

import worldgltf from './content/world.gltf'
import { Camera } from 'three';

var mixer;


function World(){

  const gltf = useLoader(GLTFLoader, worldgltf);

  mixer = new THREE.AnimationMixer(gltf.scene);

  if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach(clip => {
          const action = mixer.clipAction(clip)
          action.play();
      });
  }

  useFrame((state, delta) => {
      mixer?.update(delta)
  })

  return(
    <primitive
      object={gltf.scene}
      position={[-4,1,1]}
      />
  );
}

const Stars = () => {
  const count = 500;

  const [positions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      sizes[i] = Math.random() < 0.03 ? 15 : 6;
    }

    return [positions, sizes];
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={positions.length / 3}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} />
    </points>
  );
};

function App() {

  const [time,setTime] = useState('day');
  const [target,setTarget] = useState([0,0,0]);

  function changeTime(){
    if(time==='day'){
      setTime('night');
      document.body.style.backgroundColor = 'black'
    }else{
      setTime('day');
      document.body.style.backgroundColor = '#dbe9fb'
    }
  }

  function cameratarget(e){
    console.log(e);
    setTarget(e);
  }
  return (
    <>

    <button className='timeButton' onClick={() =>changeTime()}> night / day</button>

    <Canvas camera={{position:[-10,10,20]}}>
      
    <OrbitControls
        target={target}
        enableZoom={true}
        rotateSpeed={2}
      />
      <ambientLight intensity={0.4} />
      <directionalLight
      position={[0,10,0]}
      />
      <mesh  onClick={(e) => cameratarget(e.object.position)} >
      <World/>
      </mesh>
      <Stars />
    </Canvas>


    </>
  );
}

export default App;

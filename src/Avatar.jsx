/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { facialPositionMap, animationMap } from "./mappings.js";

export function Model(props) {
  const { nodes, materials, scene } = useGLTF(
   props.model.url
  );

  const [blink, setBlink] = useState(false);

  const lerpMorphTargets = (target, value, speed) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        // console.log(index);
        // console.log(child.morphTargetInfluences[index]);

        if (
          index == undefined ||
          child.morphTargetInfluences[index] === undefined
        )
          return;
        // console.log(index);
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    });
  };

  // useEffect(()=> {
  //   if(!props.lipsync.firstFrame) {
  //     lerpMorphTargets("mouthSmileLeft", 0.3, 0.5 );
  //     lerpMorphTargets("mouthSmileRight", 0.3, 0.5 );
  //   }
  // }, [props.lipsync.firstFrame]);

  useEffect(() => {
    console.log(scene);
  }, []);

  const resetMorphTargets = () => {
    const ignoreList = [
      "eyeBlinkLeft",
      "eyeBlinkRight",
      "mouthSmileLeft",
      "mouthSmileRight",
    ];

    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        // console.log(child.morphTargetDictionary);

        const ignoredIndices = ignoreList.map(
          (target) => child.morphTargetDictionary[target]
        );

        // console.log(eyeLeftIndex, eyeRightIndex);
        const indices = Object.values(child.morphTargetDictionary);

        indices.forEach((index) => {
          // console.log(index);
          if (!ignoredIndices.includes(index))
            child.morphTargetInfluences[index] = 0;
        });
      }
    });
  };

  const { animations } = useGLTF(
    props.model.animations
  );
  // console.log(animations);

  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions[props.currentAnimation]?.reset().fadeIn(0.5).play();

    return () => actions[props.currentAnimation]?.fadeOut(0.5);
  }, [props.currentAnimation]);

  useFrame(() => {
    lerpMorphTargets("eyeBlinkLeft", blink ? 0.75 : 0, 0.5);
    lerpMorphTargets("eyeBlinkRight", blink ? 0.75 : 0, 0.5);
  });

  useEffect(() => {
    let blinkTimeout;

    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };

    nextBlink();

    return () => clearTimeout(blinkTimeout);
  }, []);


  const [lipsyncing, setLipsyncing] = useState(false);
  useFrame(() => {
    if (props.lipsync.firstFrame) {
      setLipsyncing(true);

        // const choice = Math.floor(Math.random()*3);
        // setCurrentAnimation('explaining');
      props.setReadyToPlay(false);
      props.lipsync.firstFrame.forEach((value, index) =>
        lerpMorphTargets(facialPositionMap[index], value*0.60, 0.5)
      );
      props.lipsync.removeFrame();
    } else {

      if(lipsyncing) {
        // props.toggleRecording();
        setLipsyncing(false);
      }
        // setCurrentAnimation('idle');
      props.setReadyToPlay(true);
      resetMorphTargets();
    }
  });

  // useEffect(()=> {
  //   props.greet();
  // }, []);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      {nodes.Wolf3D_Hair && (
        <skinnedMesh
          geometry={nodes.Wolf3D_Hair.geometry}
          material={materials.Wolf3D_Hair}
          skeleton={nodes.Wolf3D_Hair.skeleton}
        />
      )}
      {nodes.Wolf3D_Glasses && <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />}
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  );
}

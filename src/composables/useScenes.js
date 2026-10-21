import { ref, computed } from 'vue';

export function useScenes(initialScenes = []) {
  const scenes = ref(JSON.parse(JSON.stringify(initialScenes)));
  const currentSceneIndex = ref(0);
  const isPresenting = ref(false);
  const isLiveRecording = ref(false);

  const currentScene = computed(() => {
    return scenes.value[currentSceneIndex.value] || scenes.value[0] || {
      name: 'cena-01',
      title: 'Apresentação CircuitFlow',
      subtitle: 'Sem cenas cadastradas',
      x: 48,
      y: 24,
      zoom: 0.9
    };
  });

  const activateScene = (idx, cameraRef) => {
    if (idx < 0 || idx >= scenes.value.length) return;
    currentSceneIndex.value = idx;
    const s = scenes.value[idx];
    if (s && cameraRef) {
      cameraRef.value = {
        x: s.x,
        y: s.y,
        zoom: s.zoom
      };
    }
  };

  const nextScene = (cameraRef) => {
    if (!scenes.value.length) return;
    const nextIdx = (currentSceneIndex.value + 1) % scenes.value.length;
    activateScene(nextIdx, cameraRef);
  };

  const prevScene = (cameraRef) => {
    if (!scenes.value.length) return;
    const prevIdx = (currentSceneIndex.value - 1 + scenes.value.length) % scenes.value.length;
    activateScene(prevIdx, cameraRef);
  };

  const captureKeyframe = (camera, selectedNode = null) => {
    const newSceneNumber = scenes.value.length + 1;
    const title = selectedNode?.title || `Keyframe de Câmera #${newSceneNumber}`;
    const subtitle = selectedNode?.subtitle || 'Transição suave cinematográfica';
    const name = selectedNode?.groupLabel || `cena-${String(newSceneNumber).padStart(2, '0')}`;

    scenes.value.push({
      name,
      title,
      subtitle,
      x: Math.round(camera.x),
      y: Math.round(camera.y),
      zoom: camera.zoom
    });

    currentSceneIndex.value = scenes.value.length - 1;
  };

  const removeScene = (idx, cameraRef) => {
    if (scenes.value.length <= 1) return;
    scenes.value.splice(idx, 1);
    if (currentSceneIndex.value >= scenes.value.length) {
      currentSceneIndex.value = scenes.value.length - 1;
    }
    activateScene(currentSceneIndex.value, cameraRef);
  };

  const toggleLiveRecording = () => {
    isLiveRecording.value = !isLiveRecording.value;
  };

  const togglePresenting = () => {
    isPresenting.value = !isPresenting.value;
  };

  return {
    scenes,
    currentSceneIndex,
    currentScene,
    isPresenting,
    isLiveRecording,
    activateScene,
    nextScene,
    prevScene,
    captureKeyframe,
    removeScene,
    toggleLiveRecording,
    togglePresenting
  };
}

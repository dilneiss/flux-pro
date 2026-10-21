import { ref } from 'vue';

export function useCanvas() {
  const camera = ref({ x: 48, y: 24, zoom: 0.9 });
  const isDraggingCanvas = ref(false);
  const dragStart = ref({ x: 0, y: 0 });

  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 2.5;

  /**
   * Start panning canvas from mouse event
   * @param {MouseEvent} e
   */
  const startPan = (e) => {
    if (e.button !== 0 && e.button !== 1) return;
    isDraggingCanvas.value = true;
    dragStart.value = {
      x: e.clientX - camera.value.x,
      y: e.clientY - camera.value.y
    };

    const onGlobalPanMove = (moveEvent) => {
      if (!isDraggingCanvas.value) return;
      if (moveEvent.buttons === 0) {
        onGlobalPanEnd();
        return;
      }
      camera.value.x = moveEvent.clientX - dragStart.value.x;
      camera.value.y = moveEvent.clientY - dragStart.value.y;
    };

    const onGlobalPanEnd = () => {
      window.removeEventListener('mousemove', onGlobalPanMove);
      window.removeEventListener('mouseup', onGlobalPanEnd);
      window.removeEventListener('blur', onGlobalPanEnd);
      isDraggingCanvas.value = false;
    };

    window.addEventListener('mousemove', onGlobalPanMove);
    window.addEventListener('mouseup', onGlobalPanEnd);
    window.addEventListener('blur', onGlobalPanEnd);
  };

  const pan = (e) => {
    if (!isDraggingCanvas.value) return;
    camera.value.x = e.clientX - dragStart.value.x;
    camera.value.y = e.clientY - dragStart.value.y;
  };

  const endPan = () => {
    isDraggingCanvas.value = false;
  };

  /**
   * Handle mouse wheel zoom
   * @param {WheelEvent} e
   */
  const onWheel = (e) => {
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.min(Math.max(camera.value.zoom * factor, MIN_ZOOM), MAX_ZOOM);
    camera.value.zoom = Number(newZoom.toFixed(2));
  };

  /**
   * Reset camera to default position
   */
  const resetCamera = () => {
    camera.value = { x: 48, y: 24, zoom: 0.85 };
  };

  /**
   * Convert screen client coordinates to canvas world coordinates
   * @param {number} clientX
   * @param {number} clientY
   * @param {DOMRect} canvasRect
   * @returns {{ x: number, y: number }}
   */
  const screenToWorld = (clientX, clientY, canvasRect) => {
    const rx = canvasRect ? canvasRect.left : 0;
    const ry = canvasRect ? canvasRect.top : 0;
    return {
      x: (clientX - rx - camera.value.x) / camera.value.zoom,
      y: (clientY - ry - camera.value.y) / camera.value.zoom
    };
  };

  /**
   * Smoothly focus camera on a specific node
   * @param {Object} node
   */
  const focusNode = (node) => {
    if (!node) return;
    camera.value = {
      x: Math.round(-node.x * 1.15 + 360),
      y: Math.round(-node.y * 1.15 + 180),
      zoom: 1.15
    };
  };

  return {
    camera,
    isDraggingCanvas,
    startPan,
    pan,
    endPan,
    onWheel,
    resetCamera,
    screenToWorld,
    focusNode
  };
}

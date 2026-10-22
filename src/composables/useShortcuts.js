import { onMounted, onUnmounted } from 'vue';

export function useShortcuts({
  onNextScene,
  onPrevScene,
  onTogglePlay,
  onEscape,
  onDeleteSelected,
  onUndo,
  onRedo,
  onPasteImage,
  onDuplicate
}) {
  const isInputFocused = () => {
    const el = document.activeElement;
    if (!el) return false;
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.isContentEditable;
  };

  const handleKeyDown = (e) => {
    if (isInputFocused()) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onNextScene?.();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onPrevScene?.();
    } else if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      onTogglePlay?.();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onEscape?.();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onDeleteSelected?.();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        onRedo?.();
      } else {
        onUndo?.();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      onRedo?.();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      onDuplicate?.();
    }
  };

  const handlePaste = (e) => {
    if (isInputFocused()) return;
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.includes('image')) {
        const blob = item.getAsFile();
        if (blob) {
          const url = URL.createObjectURL(blob);
          onPasteImage?.(url, blob);
          return;
        }
      }
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('paste', handlePaste);
  });
}

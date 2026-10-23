<script setup>
import { computed } from 'vue';
import ChipNode from './ChipNode.vue';
import TerminalNode from './TerminalNode.vue';
import FinderNode from './FinderNode.vue';
import MediaNode from './MediaNode.vue';
import CodeNode from './CodeNode.vue';
import DatabaseNode from './DatabaseNode.vue';
import ApiNode from './ApiNode.vue';
import MobileNode from './MobileNode.vue';
import BrowserNode from './BrowserNode.vue';
import MetricNode from './MetricNode.vue';
import QueueNode from './QueueNode.vue';
import HardwareNode from './HardwareNode.vue';
import DecisionNode from './DecisionNode.vue';
import CompareNode from './CompareNode.vue';
import CalloutNode from './CalloutNode.vue';
import QuestionNode from './QuestionNode.vue';

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isFocused: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['upload']);

const componentsMap = {
  chip: ChipNode,
  terminal: TerminalNode,
  finder: FinderNode,
  media: MediaNode,
  code: CodeNode,
  database: DatabaseNode,
  api: ApiNode,
  mobile: MobileNode,
  browser: BrowserNode,
  metric: MetricNode,
  queue: QueueNode,
  hardware: HardwareNode,
  decision: DecisionNode,
  compare: CompareNode,
  callout: CalloutNode,
  question: QuestionNode
};

const currentComponent = computed(() => {
  return componentsMap[props.node.type] || ChipNode;
});
</script>

<template>
  <component
    :is="currentComponent"
    :node="node"
    :is-selected="isSelected"
    :is-focused="isFocused"
    @upload="(payload) => emit('upload', payload)"
  />
</template>

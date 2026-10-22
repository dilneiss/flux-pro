/**
 * CircuitFlow Studio Catalog
 * 15 specialized node types with 3 variations each and default creation templates.
 */

export const NODE_CATALOG = [
  {
    type: 'chip',
    name: 'Chip PCB',
    icon: '▣',
    color: 'text-amber-400',
    desc: 'Caminhos, binários e módulos IC',
    defaultHeight: 112,
    variants: [
      { id: 'amber', label: 'Original' },
      { id: 'cyan', label: 'Ciano' },
      { id: 'emerald', label: 'Kernel' }
    ]
  },
  {
    type: 'terminal',
    name: 'Terminal IA',
    icon: '>_',
    color: 'text-cyan-400',
    desc: 'Claude Code, Codex ou Bash CLI',
    defaultHeight: 225,
    variants: [
      { id: 'claude', label: 'Agente IA' },
      { id: 'bash', label: 'Bash ZSH' },
      { id: 'logs', label: 'Logs' }
    ]
  },
  {
    type: 'finder',
    name: 'Finder',
    icon: '📁',
    color: 'text-blue-400',
    desc: 'Lista de aplicativos ou árvore',
    defaultHeight: 215,
    variants: [
      { id: 'macos', label: 'Finder' },
      { id: 'tree', label: 'VSCode Tree' },
      { id: 'archive', label: 'Binários' }
    ]
  },
  {
    type: 'media',
    name: 'Mídia & Vídeo',
    icon: '▶',
    color: 'text-emerald-400',
    desc: 'Aceita colar print direto dentro',
    defaultHeight: 280,
    variants: [
      { id: 'cinema', label: '16:9 Vídeo' },
      { id: 'pip', label: 'Captura' },
      { id: 'split', label: 'Demo' }
    ]
  },
  {
    type: 'code',
    name: 'Código & Diff',
    icon: '{}',
    color: 'text-purple-400',
    desc: 'C++, TypeScript, Assembly ou Diff',
    defaultHeight: 165,
    variants: [
      { id: 'code', label: 'Código' },
      { id: 'diff', label: 'Git Diff' },
      { id: 'asm', label: 'Assembly' }
    ]
  },
  {
    type: 'database',
    name: 'Banco de Dados',
    icon: '🗄',
    color: 'text-indigo-400',
    desc: 'Tabelas SQL, JSON ou Qdrant',
    defaultHeight: 190,
    variants: [
      { id: 'postgres', label: 'SQL Table' },
      { id: 'vector', label: 'Vector DB' },
      { id: 'json', label: 'Documento' }
    ]
  },
  {
    type: 'api',
    name: 'API & Webhook',
    icon: '⇄',
    color: 'text-amber-300',
    desc: 'Endpoints POST, GET e WebSockets',
    defaultHeight: 170,
    variants: [
      { id: 'post', label: 'POST JSON' },
      { id: 'get', label: 'GET 200' },
      { id: 'ws', label: 'WebSocket' }
    ]
  },
  {
    type: 'mobile',
    name: 'Mobile App',
    icon: '📱',
    color: 'text-emerald-300',
    desc: 'Simulador iPhone ou Chat Bot',
    defaultHeight: 210,
    variants: [
      { id: 'whatsapp', label: 'WhatsApp' },
      { id: 'iphone', label: 'App iOS' },
      { id: 'push', label: 'Push Alert' }
    ]
  },
  {
    type: 'browser',
    name: 'Janela SaaS',
    icon: '🌐',
    color: 'text-sky-400',
    desc: 'Janela Chrome com URL e print',
    defaultHeight: 260,
    variants: [
      { id: 'chrome', label: 'Chrome UI' },
      { id: 'dashboard', label: 'SaaS Painel' },
      { id: 'ext', label: 'Extensão' }
    ]
  },
  {
    type: 'metric',
    name: 'Métrica KPI',
    icon: '📈',
    color: 'text-teal-400',
    desc: 'FPS, Latência, MRR e Progresso',
    defaultHeight: 150,
    variants: [
      { id: 'fps', label: '60 FPS' },
      { id: 'latency', label: 'Latência' },
      { id: 'roi', label: 'Receita' }
    ]
  },
  {
    type: 'queue',
    name: 'Fila de Jobs',
    icon: '⚡',
    color: 'text-amber-400',
    desc: 'Workers assíncronos e streams',
    defaultHeight: 160,
    variants: [
      { id: 'rabbitmq', label: 'RabbitMQ' },
      { id: 'redis', label: 'Redis Queue' },
      { id: 'kafka', label: 'Stream' }
    ]
  },
  {
    type: 'hardware',
    name: 'Hardware & Deck',
    icon: '🎛',
    color: 'text-cyan-300',
    desc: 'Botões configuráveis e placas',
    defaultHeight: 190,
    variants: [
      { id: 'deck', label: 'Stream Deck' },
      { id: 'gpu', label: 'GPU Cores' },
      { id: 'prompter', label: 'Prompter' }
    ]
  },
  {
    type: 'decision',
    name: 'Decisão Lógica',
    icon: '◇',
    color: 'text-purple-400',
    desc: 'Condicional If/Else ou Auth Gate',
    defaultHeight: 130,
    variants: [
      { id: 'if', label: 'If / Else' },
      { id: 'router', label: 'OmniRoute' },
      { id: 'auth', label: 'Guard' }
    ]
  },
  {
    type: 'compare',
    name: 'Comparativo',
    icon: '⚖',
    color: 'text-rose-400',
    desc: 'Legado vs Recompilado Nativo',
    defaultHeight: 150,
    variants: [
      { id: 'versus', label: 'Lado a Lado' },
      { id: 'mig', label: 'Migração' },
      { id: 'bench', label: 'Ganho' }
    ]
  },
  {
    type: 'callout',
    name: 'Nota / Alerta',
    icon: '⚠',
    color: 'text-yellow-400',
    desc: 'Destaque técnico ou observação',
    defaultHeight: 120,
    variants: [
      { id: 'warn', label: 'Alerta' },
      { id: 'proof', label: 'Evidência' },
      { id: 'note', label: 'Nota' }
    ]
  },
  {
    type: 'question',
    name: 'Pergunta / Caminhos',
    icon: '🔀',
    color: 'text-fuchsia-400',
    desc: 'Ramificação condicional e múltiplos caminhos',
    defaultHeight: 180,
    variants: [
      { id: 'binary', label: 'Sim / Não' },
      { id: 'multi', label: 'Multi-Caminhos' },
      { id: 'router', label: 'Roteador IA' }
    ]
  }
];

export const NODE_TEMPLATES = {
  chip: {
    title: '/usr/local/bin/target.app',
    subtitle: 'BINÁRIO DE SISTEMA',
    badge: 'alvo',
    w: 432,
    content: ''
  },
  terminal: {
    title: 'Agente IA',
    subtitle: 'npx rea-agents@latest inspect',
    badge: 'MCP ativo',
    w: 456,
    content: '> Analise as funções exportadas e reconstrua o módulo de áudio.'
  },
  finder: {
    title: 'Workspace',
    subtitle: 'arquivos',
    badge: 'src/core',
    w: 360,
    content: 'main_loop.cpp\n*audio_driver.rs\nshader_cache.bin'
  },
  media: {
    title: 'Demonstração Visual',
    subtitle: 'Aperte Ctrl+V para colar print',
    badge: '[ok] 60 fps',
    w: 384,
    mediaUrl: ''
  },
  code: {
    title: 'patch_engine.rs',
    badge: 'testado',
    w: 384,
    content: '+ fn bypass_drm_check() -> bool {\n+   return true;\n+ }'
  },
  database: {
    title: 'tenants_schema',
    badge: 'PostgreSQL',
    w: 336,
    content: '*id: UUID PK\ncompany_name: VARCHAR\nvector_embedding: FLOAT[1536]'
  },
  api: {
    title: '/v1/video/render',
    badge: '200 OK',
    w: 360,
    content: '{\n  "fps": 60,\n  "resolution": "4K",\n  "status": "queued"\n}'
  },
  mobile: {
    title: 'Agente WhatsApp',
    badge: 'Online',
    w: 312,
    content: 'Olá! Como posso gerar meu vídeo?\n*Envie o roteiro e eu crio o grafo automático!'
  },
  browser: {
    title: 'Painel SaaS Multi-Tenant',
    subtitle: 'app.circuitflow.io/studio',
    badge: 'v2.0',
    w: 384,
    content: 'Renderização em nuvem ativa com workers paralelos.'
  },
  metric: {
    title: '60.0 FPS',
    subtitle: 'PERFORMANCE NATIVA',
    badge: '+142%',
    w: 288,
    content: 'Tempo de quadro estabilizado em 16.6ms'
  },
  queue: {
    title: 'RabbitMQ Render Exchange',
    badge: '4 workers',
    w: 360,
    content: 'Distribuindo cenas para containers Remotion FFmpeg'
  },
  hardware: {
    title: 'Elgato Stream Deck XL',
    badge: 'HID USB',
    w: 336,
    content: '*Play\nPause\n*Cap +1\nVel +'
  },
  decision: {
    title: 'Verificar Assinatura / Caminho',
    subtitle: 'ROTEADOR LÓGICO',
    badge: 'condicional',
    w: 336,
    content: 'Se encontrar evidência no binário ▸ Gerar prova de conceito'
  },
  compare: {
    title: 'Comparativo de Arquitetura',
    badge: 'Benchmark',
    w: 408,
    content: '20 minutos compilando\nPreso ao hardware | Instantâneo no Canvas\nMultiplataforma 60fps'
  },
  callout: {
    title: 'Nota de Engenharia',
    badge: 'Importante',
    w: 336,
    content: 'Nenhuma linha de código proprietário foi copiada durante a observação.'
  },
  question: {
    title: 'O usuário possui assinatura ativa?',
    subtitle: 'PERGUNTA CONDICIONAL',
    badge: 'Multi-Branch',
    w: 408,
    content: '*Sim ➔ Liberar Acesso 4K (60fps)\nNão ➔ Redirecionar para Checkout\nTrial ➔ Exibir Alerta de Renovação'
  }
};

/**
 * Estimate node height based on its type and content length
 * @param {Object} node
 * @returns {number}
 */
export function estimateNodeHeight(node) {
  if (!node) return 140;
  if (node.customHeight && typeof node.customHeight === 'number') {
    return node.customHeight;
  }
  if (typeof document !== 'undefined') {
    const el = document.getElementById(`node-${node.id}`);
    if (el && el.offsetHeight > 0) {
      return el.offsetHeight;
    }
  }

  const lines = (node.content && typeof node.content === 'string')
    ? node.content.split('\n').filter(Boolean).length
    : 0;

  switch (node.type) {
    case 'chip':
      return 88 + (lines > 0 ? lines * 18 : 0);
    case 'terminal':
      return 76 + (node.subtitle ? 24 : 0) + Math.max(1, lines) * 18;
    case 'finder':
      return 60 + Math.max(2, lines) * 26 + 28;
    case 'media':
      return Math.round((node.w || 384) * 9 / 16) + 48;
    case 'code':
      return 56 + Math.max(2, lines) * 18 + 24;
    case 'database':
      return 56 + Math.max(2, lines) * 24;
    case 'api':
      return 56 + Math.max(2, lines) * 18;
    case 'mobile':
      return 60 + Math.max(2, lines) * 32;
    case 'browser':
      return 60 + (node.mediaUrl ? 180 : 0) + Math.max(1, lines) * 18;
    case 'metric':
      return 130;
    case 'queue':
      return 140;
    case 'hardware':
      return 150;
    case 'decision':
      return 110;
    case 'compare':
      return 130;
    case 'callout':
      return 76 + Math.max(1, lines) * 18;
    case 'question':
      return 88 + Math.max(2, lines) * 28;
    default:
      return 76 + Math.max(1, lines) * 18;
  }
}

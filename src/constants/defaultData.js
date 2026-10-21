/**
 * Default Project Initial Data
 * Perfect non-overlapping layout matching the reference flow.
 */

export const DEFAULT_META = {
  project: 'recompilações',
  slug: 'rea',
  author: 'viktorkav'
};

export const DEFAULT_NODES = [
  {
    id: 'n1',
    type: 'chip',
    variant: 'amber',
    groupLabel: 'caminho',
    title: '/Applications/Elgato Camera Hub.app',
    subtitle: 'ENDEREÇO DO APLICATIVO NO MAC',
    badge: 'alvo',
    x: 192,
    y: 48,
    w: 624,
    content: ''
  },
  {
    id: 'n2',
    type: 'finder',
    variant: 'macos',
    groupLabel: 'no Finder',
    title: 'Applications',
    subtitle: 'pasta aplicativos',
    badge: 'Elgato Camera Hub',
    content: 'DisplayLink Manager\nElvCapture\n*Elgato Camera Hub\nElgato Stream Deck',
    x: 48,
    y: 240,
    w: 384
  },
  {
    id: 'n3',
    type: 'terminal',
    variant: 'claude',
    groupLabel: 'conversa do agente',
    title: 'Prompt de Investigação',
    subtitle: '/Applications/Elgato Camera Hub.app',
    badge: 'REA conectado',
    content: '> Use o REA pra analisar o Camera Hub nesse Mac.\n\nEu quero entender como ele controla a rolagem dos textos dos meus roteiros.\n\nMostre os arquivos ou trechos de código que sustentam a resposta.',
    x: 504,
    y: 240,
    w: 480
  },
  {
    id: 'n5',
    type: 'media',
    variant: 'cinema',
    groupLabel: 'resultado em execução',
    title: 'Zelda: The Wind Waker HD',
    subtitle: 'Recompilação Estática PowerPC ▸ C++',
    badge: '[ok] 60 fps nativo',
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    x: 1080,
    y: 48,
    w: 384,
    content: ''
  },
  {
    id: 'n4',
    type: 'code',
    variant: 'code',
    groupLabel: 'versão própria',
    title: 'prompter_controller.ts',
    badge: '[ok] testado',
    content: 'while (playing) {\n  const dt = clock.tick();\n  prompter.scrollBy(0, speed * dt);\n}',
    x: 1080,
    y: 384,
    w: 384
  }
];

export const DEFAULT_EDGES = [
  {
    id: 'e1',
    from: 'n1',
    fromPort: 'bottom',
    to: 'n2',
    toPort: 'top',
    label: 'pasta local',
    color: 'amber',
    animated: true
  },
  {
    id: 'e2',
    from: 'n1',
    fromPort: 'bottom',
    to: 'n3',
    toPort: 'top',
    label: 'o Camera Hub',
    color: 'cyan',
    animated: true
  },
  {
    id: 'e3',
    from: 'n2',
    fromPort: 'right',
    to: 'n3',
    toPort: 'left',
    label: 'copia caminho',
    color: 'cyan',
    animated: true
  },
  {
    id: 'e4',
    from: 'n3',
    fromPort: 'right',
    to: 'n4',
    toPort: 'left',
    label: 'MCP ▸ REA',
    color: 'cyan',
    animated: true
  },
  {
    id: 'e5',
    from: 'n5',
    fromPort: 'bottom',
    to: 'n4',
    toPort: 'top',
    label: 'runtime',
    color: 'amber',
    animated: true
  }
];

export const DEFAULT_SCENES = [
  {
    name: 'caminho do aplicativo',
    title: 'informe o caminho do aplicativo',
    subtitle: 'o endereço dele no computador',
    x: 48,
    y: 24,
    zoom: 0.9
  },
  {
    name: 'foco no finder',
    title: 'localize o binário no sistema',
    subtitle: 'pasta Applications do macOS',
    x: 140,
    y: -120,
    zoom: 1.2
  },
  {
    name: 'pedido ao agente',
    title: 'o pedido de investigação com evidência',
    subtitle: 'colando o caminho no Claude Code / Codex',
    x: -320,
    y: -120,
    zoom: 1.15
  },
  {
    name: 'execução e código',
    title: 'do binário fechado para uma versão própria',
    subtitle: 'resultado rodando a 60fps sem sobreposição',
    x: -760,
    y: -20,
    zoom: 1.0
  }
];

export const DEFAULT_AI_PROMPT = `chip: /Applications/Photoshop.app | Binário Proprietário Original
terminal: Engenharia Reversa via REA | Investigando máscaras e camadas PSD
code: artcraft_psd_parser.rs | Reimplementação limpa em Rust + WebGPU
media: ArtCraft Studio Aberto | Compatível com arquivos PSD a 60fps`;

/**
 * Default Project Initial Data
 * Perfect non-overlapping layout matching the reference flow,
 * with spacious vertical corridors (144px+) and spotlight scene focus.
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
    x: 96,
    y: 120,
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
    x: 96,
    y: 336,
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
    x: 864,
    y: 336,
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
    x: 1488,
    y: 120,
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
    x: 1488,
    y: 456,
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
    fromPort: 'right',
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
    id: 's1',
    name: 'caminho do aplicativo',
    title: 'informe o caminho do aplicativo',
    subtitle: 'o endereço dele no computador',
    x: 96,
    y: 72,
    zoom: 0.88,
    startTime: 0,
    duration: 5.5,
    narrationText: 'Tudo começa apontando o executável que queremos entender. Neste exemplo, mapeamos o Camera Hub na pasta de aplicativos do sistema.',
    activeNodeIds: ['n1', 'n2'],
    revealMode: true
  },
  {
    id: 's2',
    name: 'foco no finder',
    title: 'localize o binário no sistema',
    subtitle: 'pasta Applications do macOS',
    x: 96,
    y: -140,
    zoom: 1.15,
    startTime: 5.5,
    duration: 5.0,
    narrationText: 'Abrimos o Finder para validar a árvore de diretórios e extrair o caminho binário absoluto para o nosso agente de engenharia reversa.',
    activeNodeIds: ['n2'],
    revealMode: true
  },
  {
    id: 's3',
    name: 'pedido ao agente',
    title: 'o pedido de investigação com evidência',
    subtitle: 'colando o caminho no Claude Code / Codex',
    x: -420,
    y: -140,
    zoom: 1.15,
    startTime: 10.5,
    duration: 5.2,
    narrationText: 'Conectamos o agente ao protocolo MCP do REA para inspecionar os símbolos, as funções e a lógica de rolagem interna do código.',
    activeNodeIds: ['n3'],
    revealMode: true
  },
  {
    id: 's4',
    name: 'execução e código',
    title: 'do binário fechado para uma versão própria',
    subtitle: 'resultado rodando a 60fps sem sobreposição',
    x: -860,
    y: -40,
    zoom: 1.0,
    startTime: 15.7,
    duration: 5.8,
    narrationText: 'Com os padrões decodificados, reimplementamos uma versão própria em TypeScript rodando a sessenta frames por segundo com total controle.',
    activeNodeIds: ['n5', 'n4'],
    revealMode: true
  }
];

export const DEFAULT_AI_PROMPT = `chip | /bin/target_auth.bin | Binário de Autenticação | Vamos iniciar a análise por este binário de segurança encontrado no servidor.
terminal | Agente IA REA | Inspeção Estática de Símbolos | O agente decompila as instruções de máquina em busca de rotas desprotegidas.
database | PostgreSQL v16 | Tabela de Licenças e Chaves | Identificamos o banco de dados onde os tokens criptografados eram validados.
code | auth_bypass_fix.rs | Patch de Blindagem em Rust | Escrevemos a correção estrita em Rust com validação assimétrica de chaves.
media | Dashboard Protegido | Produção 100% Blindada | Sistema em execução contínua com zero vulnerabilidades e latência mínima.`;

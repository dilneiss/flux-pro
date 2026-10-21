/**
 * Marketplace SaaS — Presets Vendáveis de Alta Conversão
 * Templates completos estruturados em JSON (~4KB) prontos para uso comercial.
 */

export const MARKETPLACE_PRESETS = [
  {
    id: 'devtools-reverse-engineering',
    name: 'DevTools & Recompilação Nativa',
    tagline: 'Apresentações técnicas profundas estilo ViktorKav e George Hotz',
    category: 'DevTools & Engenharia Reversa',
    badge: 'Mais Vendido',
    price: 'R$ 197',
    stars: 5.0,
    author: 'CircuitFlow Labs',
    meta: {
      project: 'recompilações-nativas',
      slug: 'rea-kernel',
      author: 'viktorkav'
    },
    theme: 'theme-pcb',
    nodes: [
      {
        id: 'n_dt_1',
        type: 'chip',
        variant: 'amber',
        groupLabel: 'binário original',
        title: '/usr/local/bin/legacy_driver.app',
        subtitle: 'PPC / X86 BINARY BLOB',
        badge: 'alvo',
        x: 96,
        y: 48,
        w: 432,
        content: 'Header Mach-O 64-bit arm64e com chamadas legadas dependentes de hardware'
      },
      {
        id: 'n_dt_2',
        type: 'terminal',
        variant: 'claude',
        groupLabel: 'agente de desmontagem',
        title: 'Claude Code + Ghidra MCP',
        subtitle: 'npx rea-agents inspect --decompile',
        badge: 'online',
        x: 96,
        y: 288,
        w: 432,
        content: '> Inspecione a tabela de importação e isole os offsets dos registradores de áudio.'
      },
      {
        id: 'n_dt_3',
        type: 'code',
        variant: 'diff',
        groupLabel: 'patch engine',
        title: 'audio_engine.rs',
        badge: 'rust nativo',
        x: 624,
        y: 48,
        w: 408,
        content: '+ fn process_audio_buffer(dt: f32) {\n+   let samples = ring_buffer.read_exact();\n+   output_dac.push(samples);\n+ }'
      },
      {
        id: 'n_dt_4',
        type: 'metric',
        variant: 'fps',
        groupLabel: 'benchmark final',
        title: '60.0 FPS',
        subtitle: 'TEMPO DE QUADRO NATIVO',
        badge: '+180%',
        x: 624,
        y: 288,
        w: 360,
        content: 'Zero frame-drops com consumo de memória reduzido de 1.8GB para 42MB'
      }
    ],
    edges: [
      { id: 'e_dt_1', from: 'n_dt_1', fromPort: 'bottom', to: 'n_dt_2', toPort: 'top', label: 'inspeção estática', color: 'amber', animated: true },
      { id: 'e_dt_2', from: 'n_dt_2', fromPort: 'right', to: 'n_dt_3', toPort: 'left', label: 'geração de patch', color: 'cyan', animated: true },
      { id: 'e_dt_3', from: 'n_dt_3', fromPort: 'bottom', to: 'n_dt_4', toPort: 'top', label: 'validação 60fps', color: 'emerald', animated: true }
    ],
    scenes: [
      { name: 'alvo original', title: 'O Binário Fechado Original', subtitle: 'Identificando limitações do executável proprietário', x: 120, y: 30, zoom: 1.05, startTime: 0 },
      { name: 'engenharia reversa', title: 'Agente IA Conectado ao Ghidra', subtitle: 'Mapeando registradores e syscalls', x: 120, y: -200, zoom: 1.2, startTime: 4.5 },
      { name: 'reimplementação', title: 'Reescrita Limpa em Rust', subtitle: 'Compilando módulo nativo sem dependências de terceiros', x: -400, y: 30, zoom: 1.15, startTime: 9.0 },
      { name: 'resultado final', title: 'Benchmark: 60 FPS Estáveis', subtitle: 'Ganhos mensurados em telemetria', x: -400, y: -200, zoom: 1.2, startTime: 14.2 }
    ]
  },
  {
    id: 'ai-agents-rag',
    name: 'Arquitetura Multi-Agentes IA & Vector DB',
    tagline: 'Diagrama executivo de LangChain, RAG e orquestração de LLMs',
    category: 'Inteligência Artificial',
    badge: 'Popular',
    price: 'R$ 297',
    stars: 4.9,
    author: 'AI Architect Pro',
    meta: {
      project: 'agentes-autonomos',
      slug: 'multi-agent-rag',
      author: 'ai-architect'
    },
    theme: 'theme-linear',
    nodes: [
      {
        id: 'n_ai_1',
        type: 'api',
        variant: 'post',
        groupLabel: 'gateway de entrada',
        title: '/v1/agent/query',
        subtitle: 'POST JSON STREAM',
        badge: 'FastAPI',
        x: 96,
        y: 48,
        w: 360,
        content: '{\n  "query": "Como otimizar meus custos no Snowflake?",\n  "user_id": "usr_9981",\n  "stream": true\n}'
      },
      {
        id: 'n_ai_2',
        type: 'decision',
        variant: 'router',
        groupLabel: 'orquestrador inteligente',
        title: 'Router Supervisor IA',
        subtitle: 'DECISÃO SEMÂNTICA',
        badge: 'Claude 3.7',
        x: 96,
        y: 288,
        w: 360,
        content: 'Analisa intent da pergunta:\n- Se documento técnico ▸ Busca Vetorial\n- Se análise financeira ▸ Query SQL direta'
      },
      {
        id: 'n_ai_3',
        type: 'database',
        variant: 'vector',
        groupLabel: 'memória de longo prazo',
        title: 'Qdrant Vector DB',
        badge: 'Cosine 1536d',
        x: 552,
        y: 48,
        w: 360,
        content: '*doc_chunk: EMBEDDING(1536)\nmetadata_source: URL\ncluster_id: UUID PK'
      },
      {
        id: 'n_ai_4',
        type: 'callout',
        variant: 'proof',
        groupLabel: 'guardrails de segurança',
        title: 'Camada de Governança e Hallucination Check',
        badge: 'Score 0.99',
        x: 552,
        y: 288,
        w: 384,
        content: 'Evidência confirmada: 100% das respostas possuem citação direta ao documento auditado'
      }
    ],
    edges: [
      { id: 'e_ai_1', from: 'n_ai_1', fromPort: 'bottom', to: 'n_ai_2', toPort: 'top', label: 'payload streaming', color: 'cyan', animated: true },
      { id: 'e_ai_2', from: 'n_ai_2', fromPort: 'right', to: 'n_ai_3', toPort: 'left', label: 'similarity search', color: 'purple', animated: true },
      { id: 'e_ai_3', from: 'n_ai_3', fromPort: 'bottom', to: 'n_ai_4', toPort: 'top', label: 'chunks recuperados', color: 'emerald', animated: true }
    ],
    scenes: [
      { name: 'entrada', title: 'Requisição do Usuário', subtitle: 'Recebendo o prompt em streaming HTTP', x: 120, y: 30, zoom: 1.1, startTime: 0 },
      { name: 'supervisor', title: 'Roteamento com Supervisor IA', subtitle: 'Classificação semântica em menos de 100ms', x: 120, y: -200, zoom: 1.2, startTime: 5.0 },
      { name: 'vector db', title: 'Busca Semântica Qdrant', subtitle: 'Recuperando top-K documentos relevantes', x: -350, y: 30, zoom: 1.15, startTime: 10.2 },
      { name: 'guardrails', title: 'Auditoria de Alucinação', subtitle: 'Garantindo precisão jurídica e financeira', x: -350, y: -200, zoom: 1.2, startTime: 15.5 }
    ]
  },
  {
    id: 'high-ticket-funnel',
    name: 'Funil Perpétuo High-Ticket & VSL',
    tagline: 'Visualização de tráfego, automação de WhatsApp, CRM e fechamento',
    category: 'Marketing Digital & VSL',
    badge: 'Alta Conversão',
    price: 'R$ 147',
    stars: 4.8,
    author: 'Growth Academy',
    meta: {
      project: 'funil-high-ticket',
      slug: 'vsl-conversao',
      author: 'growth'
    },
    theme: 'theme-linear',
    nodes: [
      {
        id: 'n_fn_1',
        type: 'browser',
        variant: 'chrome',
        groupLabel: 'página de captura',
        title: 'VSL Cinematográfica',
        subtitle: 'https://metodo.com/aula-exclusiva',
        badge: 'Conversão 28%',
        x: 96,
        y: 48,
        w: 384,
        content: 'Vídeo interativo com retenção de 68% nos primeiros 10 minutos.'
      },
      {
        id: 'n_fn_2',
        type: 'mobile',
        variant: 'whatsapp',
        groupLabel: 'atendimento automático',
        title: 'Copiloto SDR WhatsApp',
        badge: 'Online',
        x: 96,
        y: 336,
        w: 360,
        content: 'Oi! Vi que você assistiu à apresentação.\n*Qual o faturamento mensal da sua empresa hoje?'
      },
      {
        id: 'n_fn_3',
        type: 'metric',
        variant: 'roi',
        groupLabel: 'resultado comercial',
        title: 'R$ 480.000',
        subtitle: 'FATURAMENTO NO TRIMESTRE',
        badge: '+340%',
        x: 552,
        y: 120,
        w: 360,
        content: 'CAC reduzido em 54% com automação de qualificação de leads'
      }
    ],
    edges: [
      { id: 'e_fn_1', from: 'n_fn_1', fromPort: 'bottom', to: 'n_fn_2', toPort: 'top', label: 'lead qualificado', color: 'amber', animated: true },
      { id: 'e_fn_2', from: 'n_fn_2', fromPort: 'right', to: 'n_fn_3', toPort: 'left', label: 'fechamento no call', color: 'emerald', animated: true }
    ],
    scenes: [
      { name: 'vsl', title: 'Apresentação de Alto Impacto', subtitle: 'Geração contínua de atenção e autoridade', x: 120, y: 30, zoom: 1.1, startTime: 0 },
      { name: 'whatsapp', title: 'Qualificação Instantânea', subtitle: 'Atendimento inteligente sem deixar o lead esfriar', x: 120, y: -240, zoom: 1.2, startTime: 6.0 },
      { name: 'roi', title: 'Impacto Direto na Receita', subtitle: 'Escalabilidade com previsibilidade comercial', x: -350, y: -60, zoom: 1.2, startTime: 12.0 }
    ]
  },
  {
    id: 'defi-crypto-ecosystem',
    name: 'Ecossistema Web3 DeFi & Oracles',
    tagline: 'Fluxo de liquidez, AMM, oráculos Chainlink e contratos Solidity',
    category: 'Cripto & Finanças',
    badge: 'Avançado',
    price: 'R$ 247',
    stars: 5.0,
    author: 'Web3 Builders',
    meta: {
      project: 'defi-vaults',
      slug: 'liquidity-flow',
      author: 'solidity-dev'
    },
    theme: 'theme-cyberpunk',
    nodes: [
      {
        id: 'n_cr_1',
        type: 'chip',
        variant: 'cyan',
        groupLabel: 'smart contract',
        title: 'VaultLiquidityPool.sol',
        subtitle: 'ARBITRUM ONE L2',
        badge: 'Auditado',
        x: 96,
        y: 48,
        w: 384,
        content: 'Pool de liquidez com rebalanceamento automatizado via flash-loans'
      },
      {
        id: 'n_cr_2',
        type: 'hardware',
        variant: 'gpu',
        groupLabel: 'oráculo descentralizado',
        title: 'Chainlink Data Feed',
        badge: 'Latência < 500ms',
        x: 96,
        y: 288,
        w: 360,
        content: '*ETH/USD: $3.840\n*BTC/USD: $94.200\nGas Price: 0.1 Gwei\nTVL: $12.4M'
      },
      {
        id: 'n_cr_3',
        type: 'compare',
        variant: 'bench',
        groupLabel: 'eficiência de taxa',
        title: 'Custos de Gas L1 vs L2',
        badge: 'Economia 99.2%',
        x: 552,
        y: 120,
        w: 432,
        content: 'Ethereum Mainnet: $24.50 por swap\nTempo de bloco: 12 segundos | Arbitrum Nitro: $0.04 por swap\nFinalidade instantânea em 250ms'
      }
    ],
    edges: [
      { id: 'e_cr_1', from: 'n_cr_2', fromPort: 'top', to: 'n_cr_1', toPort: 'bottom', label: 'price feed seguro', color: 'cyan', animated: true },
      { id: 'e_cr_2', from: 'n_cr_1', fromPort: 'right', to: 'n_cr_3', toPort: 'left', label: 'liquidação atômica', color: 'purple', animated: true }
    ],
    scenes: [
      { name: 'contrato', title: 'Smart Contract DeFi', subtitle: 'Lógica on-chain imutável e auditada', x: 120, y: 30, zoom: 1.15, startTime: 0 },
      { name: 'oraculo', title: 'Preços em Tempo Real', subtitle: 'Alimentação de dados descentralizada', x: 120, y: -200, zoom: 1.2, startTime: 5.5 },
      { name: 'comparativo', title: 'Redução Radical de Custos', subtitle: 'Otimização com Rollups de 2ª Camada', x: -350, y: -60, zoom: 1.15, startTime: 11.0 }
    ]
  },
  {
    id: 'clean-arch-masterclass',
    name: 'Masterclass Arquitetura Limpa',
    tagline: 'Domain-Driven Design, Ports & Adapters e Microserviços',
    category: 'Aulas Técnicas & Cursos',
    badge: 'Educacional',
    price: 'R$ 197',
    stars: 4.9,
    author: 'EduTech Academy',
    meta: {
      project: 'clean-architecture',
      slug: 'ddd-microservices',
      author: 'senior-architect'
    },
    theme: 'theme-blueprint',
    nodes: [
      {
        id: 'n_ca_1',
        type: 'chip',
        variant: 'emerald',
        groupLabel: 'núcleo do domínio',
        title: 'Domain Entities & Value Objects',
        subtitle: 'ZERO DEPENDÊNCIAS EXTERNAS',
        badge: 'Hexagonal',
        x: 96,
        y: 48,
        w: 432,
        content: 'Regras de negócio puras sem acoplamento a frameworks ou bancos de dados'
      },
      {
        id: 'n_ca_2',
        type: 'queue',
        variant: 'kafka',
        groupLabel: 'mensageria distribuída',
        title: 'Kafka Event Stream',
        badge: 'Event-Driven',
        x: 96,
        y: 288,
        w: 384,
        content: 'Publicação assíncrona de Domain Events (ex: OrderCreated, PaymentApproved)'
      },
      {
        id: 'n_ca_3',
        type: 'code',
        variant: 'code',
        groupLabel: 'porta de saída',
        title: 'OrderRepositoryPort.ts',
        badge: 'TypeScript',
        x: 600,
        y: 120,
        w: 384,
        content: 'export interface OrderRepository {\n  save(order: Order): Promise<void>;\n  findById(id: OrderId): Promise<Order | null>;\n}'
      }
    ],
    edges: [
      { id: 'e_ca_1', from: 'n_ca_1', fromPort: 'bottom', to: 'n_ca_2', toPort: 'top', label: 'dispara evento', color: 'amber', animated: true },
      { id: 'e_ca_2', from: 'n_ca_1', fromPort: 'right', to: 'n_ca_3', toPort: 'left', label: 'inversão de dependência', color: 'cyan', animated: true }
    ],
    scenes: [
      { name: 'dominio', title: 'O Coração da Aplicação', subtitle: 'Entidades limpas e invioláveis', x: 120, y: 30, zoom: 1.15, startTime: 0 },
      { name: 'eventos', title: 'Comunicação Assíncrona', subtitle: 'Desacoplamento via eventos de domínio', x: 120, y: -200, zoom: 1.2, startTime: 6.0 },
      { name: 'interfaces', title: 'Portas e Adaptadores', subtitle: 'Injeção de dependência na prática', x: -380, y: -60, zoom: 1.2, startTime: 12.0 }
    ]
  }
];

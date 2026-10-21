/**
 * Marketplace SaaS — 5 Presets Vendáveis de Alta Conversão
 * Configurados exatamente conforme a especificação do Arquiteto UX/UI.
 */

export const MARKETPLACE_PRESETS = [
  // 1. Engenharia Reversa & IA (ViktorKav Style)
  {
    id: 'engenharia-reversa-ia',
    name: 'Engenharia Reversa & IA',
    tagline: 'Binário proprietário ▸ Agente de desmontagem ▸ Código próprio ▸ Execução nativa',
    category: 'DevTools & Engenharia Reversa',
    badge: 'Mais Vendido',
    price: 'R$ 197',
    stars: 5.0,
    author: 'ViktorKav Style',
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
        y: 120,
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
        y: 336,
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
        x: 648,
        y: 120,
        w: 408,
        content: '+ fn process_audio_buffer(dt: f32) {\n+   let samples = ring_buffer.read_exact();\n+   output_dac.push(samples);\n+ }'
      },
      {
        id: 'n_dt_4',
        type: 'media',
        variant: 'cinema',
        groupLabel: 'jogo rodando nativo',
        title: 'Zelda: The Wind Waker HD',
        subtitle: 'Recompilação Estática PowerPC ▸ C++',
        badge: '[ok] 60 fps',
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        x: 648,
        y: 336,
        w: 384,
        content: ''
      }
    ],
    edges: [
      { id: 'e_dt_1', from: 'n_dt_1', fromPort: 'bottom', to: 'n_dt_2', toPort: 'top', label: 'inspeção estática', color: 'amber', animated: true },
      { id: 'e_dt_2', from: 'n_dt_2', fromPort: 'right', to: 'n_dt_3', toPort: 'left', label: 'geração de patch', color: 'cyan', animated: true },
      { id: 'e_dt_3', from: 'n_dt_3', fromPort: 'bottom', to: 'n_dt_4', toPort: 'top', label: 'execução 60fps', color: 'emerald', animated: true }
    ],
    scenes: [
      { name: 'alvo original', title: 'O Binário Fechado Original', subtitle: 'Identificando limitações do executável proprietário', x: 120, y: 72, zoom: 1.05, startTime: 0, activeNodeIds: ['n_dt_1'] },
      { name: 'engenharia reversa', title: 'Agente IA Conectado ao Ghidra', subtitle: 'Mapeando registradores e syscalls', x: 120, y: -140, zoom: 1.2, startTime: 4.5, activeNodeIds: ['n_dt_2'] },
      { name: 'reimplementação', title: 'Reescrita Limpa em Rust', subtitle: 'Compilando módulo nativo sem dependências de terceiros', x: -420, y: 72, zoom: 1.15, startTime: 9.0, activeNodeIds: ['n_dt_3'] },
      { name: 'resultado final', title: 'Jogo Rodando a 60 FPS Nativo', subtitle: 'Zero emulação com performance de ponta', x: -420, y: -140, zoom: 1.2, startTime: 14.2, activeNodeIds: ['n_dt_4'] }
    ]
  },

  // 2. Arquitetura SaaS Multi-Tenant
  {
    id: 'arquitetura-saas-multitenant',
    name: 'Arquitetura SaaS Multi-Tenant',
    tagline: 'WhatsApp Webhook ▸ RabbitMQ ▸ Agente IA + Qdrant Vector ▸ PostgreSQL',
    category: 'Arquitetura de Software',
    badge: 'Popular',
    price: 'R$ 297',
    stars: 4.9,
    author: 'SaaS Architecture Pro',
    meta: {
      project: 'saas-pipeline',
      slug: 'multi-tenant-flow',
      author: 'saas-lead'
    },
    theme: 'theme-linear',
    nodes: [
      {
        id: 'n_sa_1',
        type: 'mobile',
        variant: 'whatsapp',
        groupLabel: 'webhook de entrada',
        title: 'WhatsApp Webhook Listener',
        badge: 'WAHA HTTP API',
        x: 96,
        y: 120,
        w: 360,
        content: 'POST /api/webhook/waha\n*Payload recebido de cliente ativo\nEncaminha mensagem para fila assíncrona'
      },
      {
        id: 'n_sa_2',
        type: 'queue',
        variant: 'rabbitmq',
        groupLabel: 'buffer distribuído',
        title: 'RabbitMQ Message Broker',
        badge: 'Cluster OKE',
        x: 96,
        y: 360,
        w: 360,
        content: 'Fila: messages_inbound_queue\nWorkers assíncronos desacoplados com retries automáticos'
      },
      {
        id: 'n_sa_3',
        type: 'database',
        variant: 'vector',
        groupLabel: 'memória semântica',
        title: 'Agente IA + Qdrant Vector',
        badge: '1536d Cosine',
        x: 576,
        y: 120,
        w: 360,
        content: '*embedding: VETOR(1536)\ntenant_scope: UUID PK\ncluster_id: shard_01'
      },
      {
        id: 'n_sa_4',
        type: 'database',
        variant: 'postgres',
        groupLabel: 'persistência relacional',
        title: 'PostgreSQL Multi-Tenant',
        badge: 'Schema Isolado',
        x: 576,
        y: 360,
        w: 360,
        content: '*id: UUID PK\nbusiness_id: INT FK\nstatus: VARCHAR(32)\ncreated_at: TIMESTAMP'
      }
    ],
    edges: [
      { id: 'e_sa_1', from: 'n_sa_1', fromPort: 'bottom', to: 'n_sa_2', toPort: 'top', label: 'envia mensagem', color: 'amber', animated: true },
      { id: 'e_sa_2', from: 'n_sa_2', fromPort: 'right', to: 'n_sa_3', toPort: 'left', label: 'busca semântica', color: 'cyan', animated: true },
      { id: 'e_sa_3', from: 'n_sa_3', fromPort: 'bottom', to: 'n_sa_4', toPort: 'top', label: 'salva transação', color: 'emerald', animated: true }
    ],
    scenes: [
      { name: 'webhook', title: 'Recepção via WhatsApp Webhook', subtitle: 'Entrada de dados segura em alta disponibilidade', x: 120, y: 72, zoom: 1.1, startTime: 0, activeNodeIds: ['n_sa_1'] },
      { name: 'fila', title: 'Enfileiramento no RabbitMQ', subtitle: 'Garantia de entrega zero-data-loss', x: 120, y: -160, zoom: 1.2, startTime: 5.0, activeNodeIds: ['n_sa_2'] },
      { name: 'vector', title: 'Agente IA e Memória Qdrant', subtitle: 'Recuperação semântica e geração de resposta contextual', x: -380, y: 72, zoom: 1.15, startTime: 10.2, activeNodeIds: ['n_sa_3'] },
      { name: 'banco', title: 'Persistência no PostgreSQL', subtitle: 'Isolamento estrito por tenant e faturamento auditado', x: -380, y: -160, zoom: 1.2, startTime: 15.5, activeNodeIds: ['n_sa_4'] }
    ]
  },

  // 3. Funil de Vendas / Infoproduto
  {
    id: 'funil-vendas-infoproduto',
    name: 'Funil de Vendas & Infoproduto',
    tagline: 'Anúncio Meta Ads ▸ Landing Page ▸ Checkout PIX/Stripe ▸ Automação de E-mail',
    category: 'Marketing Digital & VSL',
    badge: 'Alta Conversão',
    price: 'R$ 147',
    stars: 4.8,
    author: 'Growth Academy',
    meta: {
      project: 'funil-escala',
      slug: 'funil-vsl',
      author: 'growth'
    },
    theme: 'theme-linear',
    nodes: [
      {
        id: 'n_fv_1',
        type: 'api',
        variant: 'post',
        groupLabel: 'tráfego pago',
        title: 'Anúncio Meta Ads',
        subtitle: 'Instagram & Facebook Reels',
        badge: 'CTR 4.2%',
        x: 96,
        y: 120,
        w: 360,
        content: 'Campanha de tráfego direto para VSL\nSegmentação: Empreendedores e Desenvolvedores\nPixel ativo com rastreamento CAPI'
      },
      {
        id: 'n_fv_2',
        type: 'browser',
        variant: 'chrome',
        groupLabel: 'página de conversão',
        title: 'Landing Page com VSL',
        subtitle: 'https://curso.io/aula-secreta',
        badge: 'Conv. 22%',
        x: 96,
        y: 336,
        w: 360,
        content: 'Vídeo dinâmico de 12 minutos com oferta irresistível e botão de compra temporizado'
      },
      {
        id: 'n_fv_3',
        type: 'api',
        variant: 'post',
        groupLabel: 'gateway de pagamento',
        title: 'Checkout PIX / Stripe',
        subtitle: 'transação segura 256-bit',
        badge: 'Aprovação 94%',
        x: 576,
        y: 120,
        w: 360,
        content: 'Webhook disparado instantaneamente:\n{ "status": "paid", "amount": 497.00, "customer": "Lead VIP" }'
      },
      {
        id: 'n_fv_4',
        type: 'callout',
        variant: 'proof',
        groupLabel: 'onboarding imediato',
        title: 'Automação de E-mail & WhatsApp',
        badge: 'Zero Delay',
        x: 576,
        y: 336,
        w: 360,
        content: 'Acesso liberado no portal do aluno em 3 segundos com credenciais automáticas'
      }
    ],
    edges: [
      { id: 'e_fv_1', from: 'n_fv_1', fromPort: 'bottom', to: 'n_fv_2', toPort: 'top', label: 'clique no anúncio', color: 'amber', animated: true },
      { id: 'e_fv_2', from: 'n_fv_2', fromPort: 'right', to: 'n_fv_3', toPort: 'left', label: 'compra realizada', color: 'emerald', animated: true },
      { id: 'e_fv_3', from: 'n_fv_3', fromPort: 'bottom', to: 'n_fv_4', toPort: 'top', label: 'disparo webhook', color: 'cyan', animated: true }
    ],
    scenes: [
      { name: 'anuncio', title: 'Atração com Anúncio Meta Ads', subtitle: 'Tráfego frio qualificado via Reels e Feed', x: 120, y: 72, zoom: 1.1, startTime: 0, activeNodeIds: ['n_fv_1'] },
      { name: 'pagina', title: 'Página de Vendas de Alta Conversão', subtitle: 'Retenção na VSL e apresentação da oferta', x: 120, y: -140, zoom: 1.2, startTime: 5.5, activeNodeIds: ['n_fv_2'] },
      { name: 'checkout', title: 'Pagamento Instantâneo PIX / Stripe', subtitle: 'Aprovação em segundos com confirmação bancária', x: -380, y: 72, zoom: 1.15, startTime: 10.5, activeNodeIds: ['n_fv_3'] },
      { name: 'entrega', title: 'Acesso Liberado Automaticamente', subtitle: 'Boas-vindas pelo WhatsApp e área de membros', x: -380, y: -140, zoom: 1.2, startTime: 15.0, activeNodeIds: ['n_fv_4'] }
    ]
  },

  // 4. Comparativo de Performance (Antes vs. Depois)
  {
    id: 'comparativo-performance',
    name: 'Comparativo de Performance',
    tagline: 'Monolito Lento ▸ Microserviço OKE/Docker ▸ KPI +300% FPS',
    category: 'Engenharia de Performance',
    badge: 'Benchmark',
    price: 'R$ 197',
    stars: 5.0,
    author: 'DevOps Elite',
    meta: {
      project: 'benchmark-infra',
      slug: 'antes-vs-depois',
      author: 'cloud-eng'
    },
    theme: 'theme-blueprint',
    nodes: [
      {
        id: 'n_cp_1',
        type: 'chip',
        variant: 'amber',
        groupLabel: 'arquitetura legada',
        title: 'Monolito Legado PHP / Apache',
        subtitle: 'SERVIDOR ON-PREMISE',
        badge: 'Lento (2.4s)',
        x: 96,
        y: 120,
        w: 432,
        content: 'Acoplamento rígido, banco de dados sem réplicas e consumo excessivo de CPU'
      },
      {
        id: 'n_cp_2',
        type: 'compare',
        variant: 'versus',
        groupLabel: 'comparativo direto',
        title: 'Monolito vs Microserviço',
        badge: 'Ganhos 10x',
        x: 96,
        y: 336,
        w: 432,
        content: '2.400ms tempo de resposta\nFalhas sob pico | 18ms latência média p99\nAuto-scaling de 0 a 100 réplicas'
      },
      {
        id: 'n_cp_3',
        type: 'metric',
        variant: 'fps',
        groupLabel: 'resultado auditado',
        title: '+340% FPS',
        subtitle: 'THROUGHPUT ESTÁVEL',
        badge: '18ms p99',
        x: 648,
        y: 120,
        w: 360,
        content: 'Capacidade aumentada de 500 req/s para 18.000 req/s sem elevar a fatura de nuvem'
      }
    ],
    edges: [
      { id: 'e_cp_1', from: 'n_cp_1', fromPort: 'bottom', to: 'n_cp_2', toPort: 'top', label: 'migração de carga', color: 'amber', animated: true },
      { id: 'e_cp_2', from: 'n_cp_2', fromPort: 'right', to: 'n_cp_3', toPort: 'left', label: 'benchmark auditado', color: 'emerald', animated: true }
    ],
    scenes: [
      { name: 'legado', title: 'O Gargalo da Infraestrutura Legada', subtitle: 'Identificando lentidão e quedas sob carga', x: 120, y: 72, zoom: 1.1, startTime: 0, activeNodeIds: ['n_cp_1'] },
      { name: 'versus', title: 'Comparativo Técnico Lado a Lado', subtitle: 'Métricas de latência e consumo de memória', x: 120, y: -140, zoom: 1.2, startTime: 5.5, activeNodeIds: ['n_cp_2'] },
      { name: 'kpi', title: 'Ganho Mensurado de +340% de Throughput', subtitle: 'Resultados comprovados em produção', x: -420, y: -40, zoom: 1.2, startTime: 11.0, activeNodeIds: ['n_cp_3'] }
    ]
  },

  // 5. Explicação de Código / DevTools
  {
    id: 'explicacao-codigo-devtools',
    name: 'Explicação de Código & DevTools',
    tagline: 'Bug Report ▸ Git Diff ▸ Teste Automatizado [ok] ▸ Deploy Produção',
    category: 'Aulas Técnicas & Cursos',
    badge: 'Educacional',
    price: 'R$ 147',
    stars: 4.9,
    author: 'Senior Code Reviewer',
    meta: {
      project: 'devtools-review',
      slug: 'git-diff-deploy',
      author: 'senior-dev'
    },
    theme: 'theme-pcb',
    nodes: [
      {
        id: 'n_cd_1',
        type: 'callout',
        variant: 'warn',
        groupLabel: 'diagnóstico do bug',
        title: 'Bug Report #402: Deadlock no Banco',
        badge: 'Crítico',
        x: 96,
        y: 120,
        w: 384,
        content: 'Transações concorrentes bloqueando a tabela tenant_invoices durante cálculo de overage'
      },
      {
        id: 'n_cd_2',
        type: 'code',
        variant: 'diff',
        groupLabel: 'patch de correção',
        title: 'billing_service.rs',
        badge: 'git diff',
        x: 96,
        y: 336,
        w: 432,
        content: '- db.query("SELECT * FROM invoices FOR UPDATE");\n+ db.query("SELECT * FROM invoices FOR UPDATE SKIP LOCKED");'
      },
      {
        id: 'n_cd_3',
        type: 'metric',
        variant: 'fps',
        groupLabel: 'validação dos testes',
        title: '34 Passed',
        subtitle: 'COBERTURA 100% REGRESSÃO',
        badge: '[ok] testado',
        x: 648,
        y: 120,
        w: 360,
        content: 'Todos os testes unitários e de concorrência aprovados no CI/CD'
      },
      {
        id: 'n_cd_4',
        type: 'chip',
        variant: 'emerald',
        groupLabel: 'deploy final',
        title: 'Produção v2.4.0 Online',
        subtitle: 'KUBERNETES ZERO DOWNTIME',
        badge: '100% deploy',
        x: 648,
        y: 336,
        w: 384,
        content: 'Deploy automatizado via GitHub Actions concluído com sucesso'
      }
    ],
    edges: [
      { id: 'e_cd_1', from: 'n_cd_1', fromPort: 'bottom', to: 'n_cd_2', toPort: 'top', label: 'análise de causa', color: 'amber', animated: true },
      { id: 'e_cd_2', from: 'n_cd_2', fromPort: 'right', to: 'n_cd_3', toPort: 'left', label: 'validação CI', color: 'cyan', animated: true },
      { id: 'e_cd_3', from: 'n_cd_3', fromPort: 'bottom', to: 'n_cd_4', toPort: 'top', label: 'deploy verificado', color: 'emerald', animated: true }
    ],
    scenes: [
      { name: 'bug', title: 'O Problema: Bug Report em Produção', subtitle: 'Identificando o gargalo de concorrência', x: 120, y: 72, zoom: 1.1, startTime: 0, activeNodeIds: ['n_cd_1'] },
      { name: 'diff', title: 'A Solução: Patch no Código com Git Diff', subtitle: 'Adicionando SKIP LOCKED para evitar contenção de locks', x: 120, y: -140, zoom: 1.2, startTime: 5.0, activeNodeIds: ['n_cd_2'] },
      { name: 'testes', title: 'Validação Automatizada com Vitest', subtitle: 'Bateria de testes provando zero regressão', x: -420, y: 72, zoom: 1.15, startTime: 10.0, activeNodeIds: ['n_cd_3'] },
      { name: 'deploy', title: 'Deploy Contínuo sem Queda', subtitle: 'Ambiente de produção estabilizado a 60fps', x: -420, y: -140, zoom: 1.2, startTime: 14.5, activeNodeIds: ['n_cd_4'] }
    ]
  }
];

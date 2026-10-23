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
  },
  // 6. Hubiss Dropshipping & Automação de Pedidos
  {
    id: 'hubiss-dropshipping-flow',
    name: 'Hubiss Dropshipping & Automação',
    tagline: 'Catálogo do Fornecedor ▸ Publicação Mercado Livre/Shopee ▸ Webhook Venda ▸ Split & Pagamento Automático Asaas ▸ Expedição e Lucro',
    category: 'Dropshipping & E-commerce',
    badge: 'Hubiss Oficial',
    price: 'R$ 297',
    stars: 5.0,
    author: 'Hubiss Engine',
    meta: {
      project: 'hubiss-dropshipping',
      slug: 'hubiss-flow',
      author: 'hubiss'
    },
    theme: 'theme-pcb',
    nodes: [
      {
        id: 'n_hb_1',
        type: 'chip',
        variant: 'amber',
        groupLabel: '01. catálogo do fornecedor',
        title: 'Catálogo Hubiss (Fornecedor Nacional)',
        subtitle: 'PRODUTO HOMOLOGADO A PREÇO DE ATACADO',
        badge: '1.420 un. estoque',
        x: 96,
        y: 120,
        w: 432,
        content: 'Custo Atacado: R$ 42,00 | SKU: HUB-FONE-TWS-01\nFornecedor verificado com expedição em até 24h úteis'
      },
      {
        id: 'n_hb_2',
        type: 'api',
        variant: 'cyan',
        groupLabel: '02. publicação multicanal',
        title: 'Integração Mercado Livre & Shopee',
        subtitle: 'PUBLICAÇÃO AUTOMÁTICA VIA USERINTEGRATION',
        badge: 'Margem 160%',
        x: 96,
        y: 360,
        w: 432,
        content: 'Preço Venda: R$ 109,90 | Lucro Bruto: R$ 67,90\nAtributos fiscais, imagens e variações sincronizados'
      },
      {
        id: 'n_hb_3',
        type: 'terminal',
        variant: 'claude',
        groupLabel: '03. venda no marketplace',
        title: 'Webhook de Novo Pedido Aprovado',
        subtitle: 'POST /webhooks/mercadolivre/orders',
        badge: 'Venda Aprovada',
        x: 624,
        y: 120,
        w: 440,
        content: '> Pedido #MLB-94827103 recebido via Webhook\n> Cliente: Marcos Silveira | Total Pago: R$ 109,90\n> Status: [PAGO] | Etiqueta Mercado Envios gerada'
      },
      {
        id: 'n_hb_4',
        type: 'decision',
        variant: 'purple',
        groupLabel: '04. split e conciliação',
        title: 'Débito Automático do Fornecedor',
        subtitle: 'SPLIT INTELIGENTE E GERAÇÃO DE SUPPLIERORDER',
        badge: 'R$ 42,00 Pago',
        x: 624,
        y: 360,
        w: 440,
        content: 'Débito imediato de R$ 42,00 da carteira Hubiss para o fornecedor.\nSe saldo insuficiente: emissão instantânea de PIX Cobrança.'
      },
      {
        id: 'n_hb_5',
        type: 'queue',
        variant: 'cyan',
        groupLabel: '05. expedição no fornecedor',
        title: 'Painel do Fornecedor (Fulfillment)',
        subtitle: 'IMPRESSÃO ZPL / PDF E ENVIO DIRETO',
        badge: 'Despachado em 12h',
        x: 1160,
        y: 120,
        w: 432,
        content: 'Fornecedor recebe a etiqueta pronta da Shopee / Mercado Envios.\nEmbala o produto sem identificação e despacha na coleta.'
      },
      {
        id: 'n_hb_6',
        type: 'metric',
        variant: 'emerald',
        groupLabel: '06. lucro do dropshipper',
        title: 'R$ 51,20 Lucro Líquido',
        subtitle: 'MARGEM LIMPA APÓS TAXAS E CUSTO DE ATACADO',
        badge: '+46.5% ROI',
        x: 1160,
        y: 360,
        w: 432,
        content: 'Venda: R$ 109,90 | Custo Atacado: R$ 42,00\nTaxa Marketplace: R$ 16,70 | Lucro Líquido no Bolso: R$ 51,20'
      }
    ],
    edges: [
      { id: 'e_hb_1', from: 'n_hb_1', fromPort: 'bottom', to: 'n_hb_2', toPort: 'top', label: 'precificação e margem', color: 'amber', animated: true },
      { id: 'e_hb_2', from: 'n_hb_2', fromPort: 'right', to: 'n_hb_3', toPort: 'left', label: 'venda efetuada', color: 'cyan', animated: true },
      { id: 'e_hb_3', from: 'n_hb_3', fromPort: 'bottom', to: 'n_hb_4', toPort: 'top', label: 'pagamento atacado', color: 'purple', animated: true },
      { id: 'e_hb_4', from: 'n_hb_4', fromPort: 'right', to: 'n_hb_5', toPort: 'left', label: 'etiqueta liberada', color: 'cyan', animated: true },
      { id: 'e_hb_5', from: 'n_hb_5', fromPort: 'bottom', to: 'n_hb_6', toPort: 'top', label: 'repasse do lucro', color: 'emerald', animated: true }
    ],
    scenes: [
      {
        name: 'catalogo',
        title: '1. Seleção no Catálogo Hubiss',
        subtitle: 'Produtos nacionais com estoque real a preço de atacado',
        x: 120,
        y: 72,
        zoom: 1.05,
        startTime: 0,
        duration: 6.5,
        narrationText: 'No ecossistema da Hubiss, o dropshipper não precisa comprar estoque antecipado. Ele navega pelo catálogo com centenas de fornecedores nacionais homologados, escolhendo produtos com estoque real e margens agressivas de atacado.',
        activeNodeIds: ['n_hb_1']
      },
      {
        name: 'publicacao',
        title: '2. Publicação no Mercado Livre e Shopee',
        subtitle: 'Sincronização automática de anúncios, títulos e estoque',
        x: 120,
        y: -150,
        zoom: 1.15,
        startTime: 6.5,
        duration: 6.5,
        narrationText: 'Com apenas um clique, o produto é publicado na conta do dropshipper no Mercado Livre ou Shopee. A Hubiss cuida do mapeamento de categorias, atributos fiscais e mantém o estoque sincronizado para evitar cancelamentos.',
        activeNodeIds: ['n_hb_2']
      },
      {
        name: 'webhook',
        title: '3. Venda Realizada e Disparo de Webhook',
        subtitle: 'Captura instantânea do pedido e geração de etiqueta oficial',
        x: -420,
        y: 72,
        zoom: 1.1,
        startTime: 13.0,
        duration: 6.0,
        narrationText: 'Quando o cliente final faz a compra no marketplace, o webhook é capturado instantaneamente pela Hubiss. O pedido é registrado no sistema e a etiqueta oficial de envio com código de rastreio já é solicitada.',
        activeNodeIds: ['n_hb_3']
      },
      {
        name: 'pagamento',
        title: '4. Pagamento Automático do Custo de Atacado',
        subtitle: 'Split financeiro e débito inteligente da carteira do dropshipper',
        x: -420,
        y: -150,
        zoom: 1.15,
        startTime: 19.0,
        duration: 7.0,
        narrationText: 'Nesta etapa fundamental, a Hubiss debita apenas o valor de custo de atacado da carteira do dropshipper e repassa para o fornecedor. Se faltar saldo, um PIX dinâmico é gerado para aprovação imediata sem travar a operação.',
        activeNodeIds: ['n_hb_4']
      },
      {
        name: 'expedicao',
        title: '5. Impressão de Etiqueta e Expedição',
        subtitle: 'O fornecedor embala e despacha sem dados de terceiros',
        x: -940,
        y: 72,
        zoom: 1.1,
        startTime: 26.0,
        duration: 6.5,
        narrationText: 'Com o pagamento garantido, o fornecedor visualiza a etiqueta em seu painel, embala o produto e despacha na coleta do marketplace em até 24 horas. O dropshipper não toca no produto em nenhum momento.',
        activeNodeIds: ['n_hb_5']
      },
      {
        name: 'lucro',
        title: '6. Lucro Líquido na Conta do Dropshipper',
        subtitle: 'Margem líquida livre após custos e taxas de marketplace',
        x: -940,
        y: -150,
        zoom: 1.15,
        startTime: 32.5,
        duration: 6.8,
        narrationText: 'Assim que a entrega é confirmada, o marketplace libera o valor total da venda para o dropshipper. Descontando o custo do fornecedor já pago, a margem líquida de lucro fica integralmente na conta bancária do vendedor.',
        activeNodeIds: ['n_hb_6']
      }
    ]
  }
];

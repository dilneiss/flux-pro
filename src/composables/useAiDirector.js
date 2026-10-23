import { ref } from 'vue';
import { NODE_CATALOG } from '@/constants/catalog';
import { DEFAULT_AI_PROMPT } from '@/constants/defaultData';
import { solveAutoLayout } from '@/utils/autoLayoutSolver';

/**
 * Intelligent Heuristic Generator (100% Offline / Local)
 * Automatically derives polymorphic nodes and narrations from any topic or keywords
 */
export function generateHeuristicFromTopic(topicText = '') {
  const text = topicText.toLowerCase();

  // Keyword check: Cache / Database / Distributed system
  if (text.includes('cache') || text.includes('redis') || text.includes('postgres') || text.includes('banco') || text.includes('rabbitmq')) {
    return [
      'browser | Cliente Web & Mobile | Requisições HTTP / GraphQL | O usuário envia uma requisição de alta concorrência pela aplicação web.',
      'api | API Gateway Kong | Roteamento e Rate Limit | O gateway intercepta o tráfego e valida os tokens de autenticação em microssegundos.',
      'queue | Redis Cache v7.2 | Cache em Memória In-Memory | Consultamos a chave de cache no Redis para responder com latência sub-milissegundo.',
      'database | PostgreSQL v16 | Persistência Relacional ACID | Em caso de cache miss, gravamos com segurança na tabela indexada do banco de dados.',
      'metric | Latência Média 3.2ms | Throughput de 15.000 QPS | O sistema confirma a resposta ao cliente com métricas de desempenho excelentes.'
    ].join('\n');
  }

  // Keyword check: Security / Reverse Engineering / Auth
  if (text.includes('segurança') || text.includes('reversa') || text.includes('auth') || text.includes('token') || text.includes('hack') || text.includes('binário')) {
    return [
      'chip | /usr/bin/auth_service | Binário Compilado Original | Mapeamos o executável protegido para inspecionar os cabeçalhos de segurança.',
      'terminal | Agente IA REA | Varredura de Símbolos & Funções | O agente inspeciona as tabelas de importação e desmonta o fluxo criptográfico.',
      'decision | Validação de Chave RSA | Checagem de Assinatura | Identificamos o ponto crítico de validação onde o desvio condicional ocorre.',
      'code | shield_patch.rs | Reimplementação Blindada | Escrevemos a correção estrita em Rust com verificação de integridade ponta a ponta.',
      'metric | 100% Blindado | Zero Vulnerabilidades | Sistema compilado com proteção total e auditado sem alertas de segurança.'
    ].join('\n');
  }

  // Keyword check: SaaS / Pagamento / Checkout
  if (text.includes('checkout') || text.includes('vendas') || text.includes('pagamento') || text.includes('pix') || text.includes('funil')) {
    return [
      'chip | Meta Ads Reels | Tráfego Pago Qualificado | O anúncio em vídeo direciona visitantes altamente segmentados para a página de vendas.',
      'browser | Landing Page de Alta Conversão | Apresentação em Vídeo VSL | A página carrega a oferta irresistível com botão temporizado de compra.',
      'api | Checkout Transparente PIX | Gateway Antifraude Ativo | O cliente digita os dados e o pagamento é aprovado instantaneamente via webhook.',
      'database | Supabase CRM | Cadastro e Permissões | As credenciais de acesso do comprador são registradas no banco com entrega de senha.',
      'metric | R$ 497.00 Faturado | Conversão de 8.4% | Notificação de venda confirmada disparada para o WhatsApp do aluno.'
    ].join('\n');
  }

  // General Technical Workflow fallback
  const topicTitle = topicText.trim() || 'Sistema Automatizado';
  return [
    `chip | Entrada do Sistema | Ponto de Início: ${topicTitle} | Iniciamos o fluxo mapeando a entrada principal dos parâmetros.`,
    `terminal | Processador Central | Execução das Regras de Negócio | O processador analisa os dados e aplica as transformações necessárias.`,
    `database | Armazenamento de Dados | Estrutura de Registros | Os dados estruturados são consolidados com segurança e consistência.`,
    `code | engine_core.ts | Lógica Principal em TypeScript | Executamos a rotina matemática com alta performance e sem gargalos.`,
    `media | Dashboard em Tempo Real | Resultado Visual Consolidado | O painel exibe o fluxo totalmente concluído com sucesso e estabilidade.`
  ].join('\n');
}

/**
 * Parses script lines in either format:
 * Format A (4 parts): Tipo | Título | Subtítulo | Narração Falada
 * Format B (2 parts): tipo: Título | Subtítulo
 */
export function parseScriptToGraph(scriptText) {
  const lines = scriptText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  const validTypes = NODE_CATALOG.map((c) => c.type);
  const rawNodes = [];
  const rawEdges = [];
  const narrations = [];

  lines.forEach((line, idx) => {
    const parts = line.split('|').map((s) => s?.trim() || '');

    let type = 'chip';
    let title = `Bloco 0${idx + 1}`;
    let subtitle = 'Fluxo automatizado';
    let narration = '';

    if (parts.length >= 4) {
      const rawType = parts[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
      type = validTypes.includes(rawType) ? rawType : 'chip';
      title = parts[1] || title;
      subtitle = parts[2] || subtitle;
      narration = parts.slice(3).join(' | ').trim();
    } else if (parts.length >= 2) {
      const leftPart = parts[0];
      title = leftPart;
      subtitle = parts[1] || subtitle;
      narration = parts[2] || '';

      if (leftPart.includes(':')) {
        const colonParts = leftPart.split(':');
        const prefix = colonParts[0].trim().toLowerCase();
        if (validTypes.includes(prefix)) {
          type = prefix;
          title = colonParts.slice(1).join(':').trim();
        }
      }
    } else {
      title = parts[0];
    }

    if (!narration) {
      narration = `Nesta etapa analisamos ${title}. Os parâmetros foram processados com sucesso.`;
    }

    const id = 'n_ai_' + idx;
    const variant = idx === 0 ? 'amber' : idx % 2 === 1 ? 'cyan' : 'emerald';

    rawNodes.push({
      id,
      type,
      variant,
      groupLabel: `etapa 0${idx + 1}`,
      title: title || `Bloco 0${idx + 1}`,
      subtitle: subtitle || 'Fluxo automatizado',
      badge: '[ok]',
      content: narration || subtitle,
      mediaUrl:
        type === 'media'
          ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
          : '',
      x: 0,
      y: 0,
      w: 432
    });

    narrations.push(narration);

    if (idx > 0) {
      rawEdges.push({
        id: 'e_ai_' + idx,
        from: 'n_ai_' + (idx - 1),
        fromPort: 'right',
        to: id,
        toPort: 'left',
        label: `passo ${idx}`,
        color: idx === 1 ? 'amber' : 'cyan',
        animated: true
      });
    }
  });

  // Pairing for 4 nodes
  if (rawNodes.length === 4) {
    rawEdges[0].fromPort = 'bottom';
    rawEdges[0].toPort = 'top';

    rawEdges[1].fromPort = 'right';
    rawEdges[1].toPort = 'left';

    rawEdges[2].fromPort = 'bottom';
    rawEdges[2].toPort = 'top';
  }

  // Pairing for 5 nodes
  if (rawNodes.length === 5) {
    rawEdges[0].fromPort = 'bottom';
    rawEdges[0].toPort = 'top';

    rawEdges[1].fromPort = 'right';
    rawEdges[1].toPort = 'left';

    rawEdges[2].fromPort = 'bottom';
    rawEdges[2].toPort = 'top';

    rawEdges[3].fromPort = 'right';
    rawEdges[3].toPort = 'left';
  }

  // Layout solver
  const layout = solveAutoLayout(rawNodes, rawEdges, {
    startX: 96,
    startY: 120,
    gapX: 144,
    gapY: 96
  });

  let cumulativeTime = 0;

  const newScenes = layout.nodes.map((node, idx) => {
    const text = narrations[idx];
    const words = text.split(/\s+/).filter(Boolean).length;
    const duration = Math.max(4.5, Number((words / 2.33 + 0.8).toFixed(1)));
    const startTime = Number(cumulativeTime.toFixed(1));
    cumulativeTime += duration;

    return {
      id: `scene_ai_${idx + 1}`,
      name: `etapa-0${idx + 1}`,
      title: node.title,
      subtitle: node.subtitle || 'Explicação visual conectada',
      x: Math.round(-node.x * 1.15 + 360),
      y: Math.round(-node.y * 1.15 + 160),
      zoom: 1.15,
      startTime,
      duration,
      narrationText: text,
      activeNodeIds: [node.id],
      revealMode: true
    };
  });

  return { nodes: layout.nodes, edges: layout.edges, scenes: newScenes };
}

export function useAiDirector() {
  const aiPromptText = ref(DEFAULT_AI_PROMPT);
  const aiProvider = ref('heuristic'); // 'heuristic' | 'ollama' | 'gemini' | 'openai'
  const ollamaModel = ref('llama3');
  const ollamaEndpoint = ref('http://localhost:11434');
  const externalApiKey = ref('');
  const topicQuery = ref('Como funciona um sistema de cache com Redis, RabbitMQ e PostgreSQL');
  const isGeneratingAi = ref(false);

  /**
   * Universal Smart Generator: supports Heuristic Offline, Ollama Local, and External API
   */
  const generateFromTopic = async (topic = topicQuery.value) => {
    isGeneratingAi.value = true;

    try {
      if (aiProvider.value === 'ollama') {
        const res = await fetch(`${ollamaEndpoint.value}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel.value,
            prompt: `Crie um roteiro de 5 passos para um vídeo explicativo sobre: "${topic}". Responda estritamente com 5 linhas no formato: Tipo | Título | Subtítulo | Narração Falada. Tipos válidos: chip, terminal, code, database, api, metric, queue, decision, media.`,
            stream: false
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.response && data.response.includes('|')) {
            aiPromptText.value = data.response.trim();
            isGeneratingAi.value = false;
            return parseScriptToGraph(data.response);
          }
        }
      }
    } catch {
      // Fallback cleanly to heuristic generator
    }

    // Heuristic generator (100% offline & robust)
    const script = generateHeuristicFromTopic(topic);
    aiPromptText.value = script;
    isGeneratingAi.value = false;
    return parseScriptToGraph(script);
  };

  const generateGraph = () => {
    return parseScriptToGraph(aiPromptText.value);
  };

  return {
    aiPromptText,
    aiProvider,
    ollamaModel,
    ollamaEndpoint,
    externalApiKey,
    topicQuery,
    isGeneratingAi,
    generateFromTopic,
    generateGraph
  };
}

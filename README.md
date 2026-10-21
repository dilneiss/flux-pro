# CircuitFlow Studio v2.0 — Visual Presentation Engine

CircuitFlow Studio é uma engine visual interativa para criação de diagramas arquiteturais dinâmicos, apresentações técnicas cinematográficas e fluxos visuais estilo ViktorKav, com conexões ortogonais Manhattan, animação de pulso elétrico, câmera fluida por keyframes, 15 modelos de blocos especializados, inteligência de colagem de prints via Ctrl+V e diretor IA de roteiro para grafo.

---

## ⚡ Funcionalidades Principais

1. **Canvas Infinito Reativo**:
   - Pan e zoom suaves com suporte a mouse, wheel e atalhos.
   - Temas visuais: *ViktorKav PCB*, *Blueprint Eng*, *Linear Minimal*, *Chroma / Alpha* e *Cyberpunk Neon*.
   - Grade magnética e auto-alinhamento inteligente anti-sobreposição.

2. **Roteamento Ortogonal Manhattan (Cabling)**:
   - 4 portas magnéticas de conexão por bloco (Topo, Direita, Baixo, Esquerda).
   - Rota ortogonal automática calculando curvas limpas entre blocos.
   - Puxada de cabos interativa em tempo real com indicador tracejado.
   - Pulso elétrico animado em SVG (*electrical flow*).
   - Rótulos informativos no ponto médio de cada conexão.

3. **15 Modelos Especializados com Variações (45 Presets)**:
   - `01. Chip PCB / Caminho` (Original, Ciano, Kernel)
   - `02. Prompt / Agente IA` (Claude Code, Bash ZSH, Logs)
   - `03. Finder / Arquivos` (macOS Finder, VSCode Tree, Binários)
   - `04. Vídeo / Imagem` (16:9 Cinema, Captura PiP, Demo) com suporte a Ctrl+V e drag-and-drop
   - `05. Código / Diff Git` (Código, Git Diff, Assembly)
   - `06. Banco de Dados / Vector` (PostgreSQL, Vector DB, Documento JSON)
   - `07. API / Webhook REST` (POST JSON, GET 200, WebSockets)
   - `08. Mobile / WhatsApp UI` (WhatsApp, iPhone App, Push Alert)
   - `09. Browser / SaaS Window` (Chrome UI, SaaS Dashboard, Extensão)
   - `10. Métrica / Benchmark KPI` (60 FPS, Latência, ROI)
   - `11. Fila / RabbitMQ / Redis` (RabbitMQ, Redis Queue, Kafka)
   - `12. Hardware / Stream Deck` (Stream Deck XL, GPU Cores, Prompter)
   - `13. Decisão / Roteador IA` (If/Else, OmniRoute, Auth Guard)
   - `14. Comparativo Antes/Depois` (Versus, Migração, Benchmark)
   - `15. Callout / Evidência` (Alerta, Prova Técnica, Nota)

4. **Diretor IA (Script-to-Graph)**:
   - Converte roteiros textuais (`tipo: Título | Subtítulo`) em grafos completos com nós, cabos e cenas de câmera sincronizadas.

5. **Modo Apresentador & Gravação ao Vivo**:
   - Transição cinematográfica suave entre keyframes de câmera.
   - Modo gravação: cliques no canvas geram novos keyframes automaticamente.
   - Tela cheia (*Modo Gravar*) com HUD narrativo minimalista.

6. **Exportação Comercial**:
   - AST JSON completo.
   - Componente nativo para **Remotion (React 60fps)** pronto para renderizar vídeos com câmera contínua.

7. **API Node.js & Express**:
   - Gerenciamento de projetos persistentes (`/api/projects`).
   - Upload de imagens e capturas multipart (`/api/upload`).
   - Parsing de roteiros no servidor (`/api/ai/parse-script`).

---

## 🛠 Arquitetura do Projeto

```
flux-pro/
├── server/                    # Backend Node.js + Express
│   ├── index.js               # Servidor principal (porta 3001)
│   ├── routes/
│   │   ├── projects.js        # CRUD de projetos
│   │   ├── upload.js          # Upload de mídia com Multer
│   │   └── ai.js              # Parser de roteiros para grafos
│   └── storage/               # Armazenamento persistente
│       ├── projects/
│       └── uploads/
├── src/                       # Frontend Vue 3 + Tailwind CSS
│   ├── main.js
│   ├── App.vue                # Componente orquestrador raiz
│   ├── style.css              # Diretivas Tailwind e animações
│   ├── constants/             # Constantes isoladas
│   │   ├── catalog.js         # Catálogo dos 15 modelos e dimensões
│   │   ├── defaultData.js     # Nós, conexões e cenas padrão
│   │   └── themes.js          # Temas visuais do canvas
│   ├── composables/           # Lógica reativa limpa e testável
│   │   ├── useCanvas.js       # Controle de pan, zoom e coordenadas
│   │   ├── useGraph.js        # Gerenciamento de nós, conexões e histórico
│   │   ├── useManhattan.js    # Roteamento ortogonal de cabos
│   │   ├── useScenes.js       # Keyframes e câmera de apresentação
│   │   ├── useAiDirector.js   # Script-to-graph do diretor IA
│   │   └── useShortcuts.js    # Atalhos de teclado (Setas, Ctrl+Z, Ctrl+V)
│   ├── components/
│   │   ├── canvas/            # Canvas, cabos SVG e nós reativos
│   │   ├── nodes/             # 15 componentes visuais especializados
│   │   ├── sidebar/           # Abas da dock lateral esquerda
│   │   ├── inspector/         # Gaveta lateral direita de propriedades
│   │   └── layout/            # Barras TMUX (topo e rodapé) e HUD
│   └── utils/
│       └── textParser.js      # Parser de listas com destaque '*'
├── tests/                     # Suite de testes automatizados Vitest
│   ├── manhattan.test.js      # Testes do roteamento ortogonal
│   ├── autoLayout.test.js     # Testes do algoritmo anti-sobreposição
│   ├── aiDirector.test.js     # Testes do parser do diretor IA
│   ├── graphStore.test.js     # Testes de mutações do grafo e undo/redo
│   ├── manhattanAllPorts.test.js # Testes das 16 permutações ortogonais
│   ├── elevenLabs.test.js     # Testes de timestamps e sincronização de voz
│   └── marketplacePresets.test.js # Validação dos 5 templates comerciais
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🚀 Como Executar

### 1. Instalar dependências
```bash
pnpm install
# ou npm install
```

### 2. Rodar Testes Unitários
```bash
pnpm test
```

### 3. Rodar em Desenvolvimento (Frontend + API)
```bash
pnpm dev:all
```
Ou em terminais separados:
- **API Node.js**: `pnpm server` (porta 3001)
- **Vite Web**: `pnpm dev` (porta 5173)

Acesse no navegador: **`http://localhost:5173`**

### 4. Build de Produção
```bash
pnpm build
```

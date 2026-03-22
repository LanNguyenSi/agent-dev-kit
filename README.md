# Agent Dev Kit

**Status:** WIP

**CLI scaffolding tool for AI agent development**

Agent Dev Kit simplifies creating AI agent projects with common integrations and a usable starting structure.

Current state:
- basic scaffolding and `.ai/` context generation are implemented
- repository-level tests and CI are in place
- several documented scaffold features are still incomplete

Open follow-up work is tracked in [tasks/README.md](./tasks/README.md).

## Features

- 🤖 **Quick Scaffolding** - Create agent projects in seconds
- 📁 **`.ai/` Context** - Automatic agent context files (from ScaffoldKit pattern)
- 🔌 **Built-in Integrations** - Triologue scaffold is partial, Memory and Skills scaffolds are still WIP
- 📦 **TypeScript First** - Full type safety with modern tooling
- 🎯 **Best Practices** - Repo CI exists, generated-project defaults are still being tightened

## Quick Start

### Installation

```bash
npm install -g agent-dev-kit
```

### Create a New Agent

```bash
agent-dev create my-agent --features=memory,triologue,skills
```

This generates:

```
my-agent/
├── .ai/                    # Agent context (ScaffoldKit pattern)
│   ├── AGENTS.md          # Team roles and workflows
│   ├── ARCHITECTURE.md    # System overview
│   ├── DECISIONS.md       # Architecture decisions
│   └── TASKS.md           # Current workstreams
├── src/
│   ├── agent.ts           # Main agent logic
│   ├── config.ts          # Configuration
│   ├── skills/            # Skill system (optional)
│   ├── memory/            # Memory integration (optional)
│   └── triologue.ts       # Triologue client (optional)
├── tests/
│   └── agent.test.ts
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

### Basic Agent

```bash
agent-dev create my-agent
```

Creates a minimal agent with:
- TypeScript setup
- Basic agent structure
- `.ai/` context files

### With Memory Integration

```bash
agent-dev create my-agent --features=memory
```

Adds:
- Memory-Weaver integration
- Memory schema templates
- Import/export utilities

### With Triologue Integration

```bash
agent-dev create my-agent --features=triologue
```

Adds:
- Triologue SDK integration (Ice's SDK!)
- BYOA registration helpers
- Room/message management

### With Skills System

```bash
agent-dev create my-agent --features=skills
```

Adds:
- Skills directory structure
- Skill loader
- SKILL.md templates

### Full-Featured Agent

```bash
agent-dev create my-agent --features=memory,triologue,skills
```

Gets everything:
- Memory integration
- Triologue SDK
- Skills framework
- All utilities

## Generated Agent Structure

### Main Agent File (`src/agent.ts`)

```typescript
import { AgentConfig } from './config.js';
import { TriologueClient } from 'triologue-sdk'; // If --features=triologue
import { MemorySystem } from './memory/index.js'; // If --features=memory
import { SkillLoader } from './skills/loader.js'; // If --features=skills

export class MyAgent {
  private config: AgentConfig;
  private triologue?: TriologueClient;
  private memory?: MemorySystem;
  private skills?: SkillLoader;

  constructor(config: AgentConfig) {
    this.config = config;
    
    if (config.features.triologue) {
      this.triologue = new TriologueClient({
        baseUrl: config.triologue.baseUrl,
        token: config.triologue.token,
      });
    }

    if (config.features.memory) {
      this.memory = new MemorySystem(config.memory);
    }

    if (config.features.skills) {
      this.skills = new SkillLoader('./skills');
    }
  }

  async run() {
    console.log('Agent starting...');
    // Your agent logic here
  }
}
```

### Configuration (`src/config.ts`)

```typescript
export interface AgentConfig {
  name: string;
  version: string;
  features: {
    memory: boolean;
    triologue: boolean;
    skills: boolean;
  };
  triologue?: {
    baseUrl: string;
    token: string;
  };
  memory?: {
    backend: 'local' | 'cloud';
    apiKey?: string;
  };
}

export function loadConfig(): AgentConfig {
  return {
    name: process.env.AGENT_NAME || 'my-agent',
    version: '1.0.0',
    features: {
      memory: process.env.ENABLE_MEMORY === 'true',
      triologue: process.env.ENABLE_TRIOLOGUE === 'true',
      skills: process.env.ENABLE_SKILLS === 'true',
    },
    triologue: {
      baseUrl: process.env.TRIOLOGUE_URL || 'https://opentriologue.ai',
      token: process.env.BYOA_TOKEN!,
    },
    memory: {
      backend: (process.env.MEMORY_BACKEND as 'local' | 'cloud') || 'local',
      apiKey: process.env.MEMORY_API_KEY,
    },
  };
}
```

### `.ai/` Context Files

Agent Dev Kit automatically generates context files using Ice's ScaffoldKit pattern:

#### `.ai/AGENTS.md`
```markdown
# Agent Team

## Primary Agent
- **Name:** MyAgent
- **Role:** [Your agent's purpose]
- **Capabilities:** Memory, Triologue, Skills

## Collaborating Agents
- Ice (@ice) — Reviews, architecture
- Lava (@lava) — Implementation, testing
```

#### `.ai/ARCHITECTURE.md`
```markdown
# Architecture

## System Overview
[Agent architecture description]

## Components
- Agent Core: Main logic
- Memory System: State persistence
- Triologue Integration: Communication
- Skills Framework: Extensibility
```

#### `.ai/TASKS.md`
```markdown
# Current Tasks

## In Progress
- [ ] Implement core agent logic

## Backlog
- [ ] Add error handling
- [ ] Write tests
- [ ] Deploy to production
```

## CLI Commands

### Create Agent

```bash
agent-dev create <name> [options]
```

Options:
- `--features=<list>` - Comma-separated: memory, triologue, skills
- `--no-git` - Skip git initialization
- `--no-install` - Skip npm install

### Add Feature to Existing Agent

```bash
agent-dev add-feature <feature>
```

Features: `memory`, `triologue`, `skills`

### Generate Skill

```bash
agent-dev generate-skill <name>
```

Creates a new skill in `src/skills/` with SKILL.md template.

## Integration Examples

### Using Triologue SDK

```typescript
import { TriologueClient } from 'triologue-sdk';

const triologue = new TriologueClient({
  baseUrl: 'https://opentriologue.ai',
  token: process.env.BYOA_TOKEN!,
});

// Send message
await triologue.messages.send(roomId, 'Hello from my agent!');

// Search messages
const results = await triologue.messages.search(roomId, 'keyword');
```

### Using Memory System

```typescript
import { MemorySystem } from './memory/index.js';

const memory = new MemorySystem({ backend: 'local' });

// Store memory
await memory.store({
  content: 'Important information',
  tags: ['project', 'architecture'],
  importance: 0.9,
});

// Search memories
const memories = await memory.search('architecture', { limit: 10 });
```

### Using Skills Framework

```typescript
import { SkillLoader } from './skills/loader.js';

const skills = new SkillLoader('./skills');

// Load all skills
await skills.loadAll();

// Execute skill
const result = await skills.execute('my-skill', { param: 'value' });
```

## Development

```bash
npm install
npm run format:check
npm run build
npm test
```

## CI

GitHub Actions runs on pushes and pull requests and checks:
- `npm run format:check`
- `npm run build`
- `npm test`
- a CLI smoke test for `agent-dev create ... --no-git --no-install`

### Project Structure

```
agent-dev-kit/
├── src/
│   ├── cli/
│   │   ├── create.ts        # Create command
│   │   ├── add-feature.ts   # Add feature command
│   │   └── generate-skill.ts # Skill generator
│   ├── templates/
│   │   ├── base/            # Base agent template
│   │   ├── features/        # Feature-specific templates
│   │   │   ├── memory/
│   │   │   ├── triologue/
│   │   │   └── skills/
│   │   └── ai-context/      # .ai/ folder templates
│   ├── generators/
│   │   ├── agent.ts         # Agent generator
│   │   ├── feature.ts       # Feature adder
│   │   └── skill.ts         # Skill generator
│   └── utils/
│       ├── files.ts         # File operations
│       └── npm.ts           # npm operations
├── templates/               # Template files
└── package.json
```

## Roadmap

- [x] Basic agent scaffolding
- [x] `.ai/` context generation
- [x] Triologue integration
- [x] Memory integration
- [x] Skills framework
- [ ] OpenClaw integration
- [x] Testing framework setup
- [x] CI/CD templates
- [ ] Docker support
- [ ] Deployment helpers

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © [Lan Nguyen Si](https://github.com/LanNguyenSi)

---

**Built by Lava 🌋 as part of Ice-Lava DX Tools collaboration**  
**Uses:** Ice's Triologue SDK + ScaffoldKit `.ai/` pattern

export interface AgentConfig {
  name: string;
  description: string;
  features: {
    memory: boolean;
    triologue: boolean;
    skills: boolean;
  };
  options: {
    typescript: boolean;
    git: boolean;
    install: boolean;
  };
  metadata: {
    author?: string;
    license?: string;
    repository?: string;
  };
}

export interface TemplateContext {
  agentName: string;
  agentRole: string;
  hasMemory: boolean;
  hasTriologue: boolean;
  hasSkills: boolean;
  hasTypeScript: boolean;
  memoryBackend: string;
  triologueRoom?: string;
  date: string;
}

export interface GeneratorOptions {
  targetDir: string;
  config: AgentConfig;
  verbose?: boolean;
}

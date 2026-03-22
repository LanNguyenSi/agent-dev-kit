import path from "path";
import Handlebars from "handlebars";
import type {
  AgentConfig,
  TemplateContext,
  GeneratorOptions,
} from "../types.js";
import { FileUtils } from "../utils/files.js";

export class AgentGenerator {
  private config: AgentConfig;
  private targetDir: string;
  private verbose: boolean;

  constructor(options: GeneratorOptions) {
    this.config = options.config;
    this.targetDir = options.targetDir;
    this.verbose = options.verbose || false;
  }

  /**
   * Generate template context from config
   */
  private getTemplateContext(): TemplateContext {
    return {
      agentName: this.config.name,
      agentRole: this.config.description || "AI Agent",
      hasMemory: this.config.features.memory,
      hasTriologue: this.config.features.triologue,
      hasSkills: this.config.features.skills,
      hasTypeScript: this.config.options.typescript,
      memoryBackend: "local",
      date: new Date().toISOString().split("T")[0],
    };
  }

  /**
   * Log message if verbose
   */
  private log(message: string): void {
    if (this.verbose) {
      console.log(message);
    }
  }

  /**
   * Generate .ai/ context files
   */
  private async generateAiContext(): Promise<void> {
    this.log("Generating .ai/ context files...");

    const context = this.getTemplateContext();
    const aiDir = path.join(this.targetDir, ".ai");
    await FileUtils.ensureDir(aiDir);

    const contextFiles = [
      "AGENTS.md",
      "ARCHITECTURE.md",
      "TASKS.md",
      "DECISIONS.md",
    ];

    for (const file of contextFiles) {
      const templateContent = await FileUtils.readTemplate(
        `ai-context/${file}.hbs`,
      );
      const template = Handlebars.compile(templateContent);
      const content = template(context);

      await FileUtils.writeFile(path.join(aiDir, file), content);
      this.log(`  ✓ ${file}`);
    }
  }

  /**
   * Generate package.json
   */
  private async generatePackageJson(): Promise<void> {
    this.log("Generating package.json...");

    const packageJson = {
      name: this.config.name,
      version: "1.0.0",
      description: this.config.description || "AI Agent",
      main: this.config.options.typescript ? "dist/index.js" : "src/index.js",
      type: "module",
      scripts: this.config.options.typescript
        ? {
            build: "tsc",
            dev: "tsc --watch",
            start: "node dist/index.js",
            test: 'echo \"Error: no test specified\" && exit 1',
          }
        : {
            start: "node src/index.js",
            test: 'echo \"Error: no test specified\" && exit 1',
          },
      keywords: ["ai", "agent"],
      author: this.config.metadata?.author || "",
      license: this.config.metadata?.license || "MIT",
      dependencies: this.getDependencies(),
      devDependencies: this.config.options.typescript
        ? {
            "@types/node": "^20.11.0",
            typescript: "^5.3.3",
          }
        : {},
    };

    await FileUtils.writeFile(
      path.join(this.targetDir, "package.json"),
      JSON.stringify(packageJson, null, 2),
    );
    this.log("  ✓ package.json");
  }

  /**
   * Get dependencies based on features
   */
  private getDependencies(): Record<string, string> {
    const deps: Record<string, string> = {
      dotenv: "^16.4.0",
    };

    if (this.config.features.triologue) {
      deps["triologue-sdk"] = "^0.1.0";
    }

    return deps;
  }

  /**
   * Generate TypeScript config
   */
  private async generateTsConfig(): Promise<void> {
    if (!this.config.options.typescript) return;

    this.log("Generating tsconfig.json...");

    const tsConfig = {
      compilerOptions: {
        target: "ES2022",
        module: "ES2022",
        moduleResolution: "node",
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"],
    };

    await FileUtils.writeFile(
      path.join(this.targetDir, "tsconfig.json"),
      JSON.stringify(tsConfig, null, 2),
    );
    this.log("  ✓ tsconfig.json");
  }

  /**
   * Generate .gitignore
   */
  private async generateGitignore(): Promise<void> {
    this.log("Generating .gitignore...");

    const content = `node_modules/
${this.config.options.typescript ? "dist/\n" : ""}*.log
.env
.env.local
.DS_Store
`;

    await FileUtils.writeFile(path.join(this.targetDir, ".gitignore"), content);
    this.log("  ✓ .gitignore");
  }

  /**
   * Generate .env.example
   */
  private async generateEnvExample(): Promise<void> {
    this.log("Generating .env.example...");

    let content = `# Agent Configuration
AGENT_NAME=${this.config.name}
NODE_ENV=development
`;

    if (this.config.features.triologue) {
      content += `\n# Triologue
BYOA_TOKEN=your-token-here
TRIOLOGUE_URL=https://opentriologue.ai
`;
    }

    if (this.config.features.memory) {
      content += `\n# Memory
MEMORY_BACKEND=local
MEMORY_API_KEY=your-key-here
`;
    }

    await FileUtils.writeFile(
      path.join(this.targetDir, ".env.example"),
      content,
    );
    this.log("  ✓ .env.example");
  }

  /**
   * Generate README
   */
  private async generateReadme(): Promise<void> {
    this.log("Generating README.md...");

    const content = `# ${this.config.name}

${this.config.description || "AI Agent"}

## Features

${this.config.features.memory ? "- 🧠 Memory System\n" : ""}${this.config.features.triologue ? "- 📡 Triologue Integration\n" : ""}${this.config.features.skills ? "- 🎯 Skills Framework\n" : ""}
## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Configure environment:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

3. ${this.config.options.typescript ? "Build and run" : "Run"}:
\`\`\`bash
${this.config.options.typescript ? "npm run build\n" : ""}npm start
\`\`\`

## Development

${
  this.config.options.typescript
    ? `\`\`\`bash
npm run dev  # Watch mode
\`\`\`
`
    : ""
}
## Documentation

See [\`.ai/ARCHITECTURE.md\`](.ai/ARCHITECTURE.md) for system overview.

## License

${this.config.metadata?.license || "MIT"}
`;

    await FileUtils.writeFile(path.join(this.targetDir, "README.md"), content);
    this.log("  ✓ README.md");
  }

  /**
   * Generate main agent file
   */
  private async generateMainFile(): Promise<void> {
    this.log("Generating main agent file...");

    const ext = this.config.options.typescript ? "ts" : "js";
    const srcDir = path.join(this.targetDir, "src");
    await FileUtils.ensureDir(srcDir);

    const content = `${this.config.options.typescript ? "import { config } from 'dotenv';\n" : "import dotenv from 'dotenv';\n"}${this.config.features.triologue ? "import { Triologue } from 'triologue-sdk';\n" : ""}
${this.config.options.typescript ? "config();\n" : "dotenv.config();\n"}
export class Agent {
  private name: string;${this.config.features.triologue ? "\n  private triologue?: Triologue;" : ""}

  constructor() {
    this.name = process.env.AGENT_NAME || '${this.config.name}';
    ${
      this.config.features.triologue
        ? `
    if (process.env.BYOA_TOKEN) {
      this.triologue = new Triologue({
        baseUrl: process.env.TRIOLOGUE_URL || 'https://opentriologue.ai',
        token: process.env.BYOA_TOKEN,
      });
    }`
        : ""
    }
  }

  async run() {
    console.log(\`\${this.name} starting...\`);
    // Your agent logic here
  }
}

// Main
const agent = new Agent();
agent.run().catch(console.error);
`;

    await FileUtils.writeFile(path.join(srcDir, `index.${ext}`), content);
    this.log(`  ✓ src/index.${ext}`);
  }

  /**
   * Generate complete agent
   */
  async generate(): Promise<void> {
    console.log(`\nGenerating agent: ${this.config.name}\n`);

    await this.generateAiContext();
    await this.generatePackageJson();
    await this.generateTsConfig();
    await this.generateGitignore();
    await this.generateEnvExample();
    await this.generateReadme();
    await this.generateMainFile();

    console.log(`\n✅ Agent generated successfully at: ${this.targetDir}\n`);
  }
}

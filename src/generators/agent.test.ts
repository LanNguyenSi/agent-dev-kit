import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { AgentGenerator } from "./agent.js";
import type { AgentConfig } from "../types.js";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirs
      .splice(0)
      .map((dirPath) => rm(dirPath, { recursive: true, force: true })),
  );
});

describe("AgentGenerator", () => {
  it("generates a TypeScript agent with selected features and context files", async () => {
    const targetDir = await createTempDir();
    const config = createConfig({
      name: "release-helper",
      description: "Release automation agent",
      features: {
        memory: true,
        triologue: true,
        skills: true,
      },
      options: {
        typescript: true,
        git: false,
        install: false,
      },
    });

    const generator = new AgentGenerator({
      targetDir,
      config,
    });

    await generator.generate();

    await expectFile(path.join(targetDir, ".ai", "AGENTS.md"));
    await expectFile(path.join(targetDir, ".ai", "ARCHITECTURE.md"));
    await expectFile(path.join(targetDir, ".ai", "TASKS.md"));
    await expectFile(path.join(targetDir, ".ai", "DECISIONS.md"));
    await expectFile(path.join(targetDir, ".env.example"));
    await expectFile(path.join(targetDir, ".gitignore"));
    await expectFile(path.join(targetDir, "README.md"));
    await expectFile(path.join(targetDir, "tsconfig.json"));
    await expectFile(path.join(targetDir, "src", "index.ts"));

    const packageJson = JSON.parse(
      await readFile(path.join(targetDir, "package.json"), "utf8"),
    ) as {
      scripts: Record<string, string>;
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };

    expect(packageJson.scripts.build).toBe("tsc");
    expect(packageJson.scripts.start).toBe("node dist/index.js");
    expect(packageJson.dependencies.dotenv).toBe("^16.4.0");
    expect(packageJson.dependencies["triologue-sdk"]).toBe("^0.1.0");
    expect(packageJson.devDependencies.typescript).toBe("^5.3.3");

    const envExample = await readFile(
      path.join(targetDir, ".env.example"),
      "utf8",
    );
    expect(envExample).toContain("AGENT_NAME=release-helper");
    expect(envExample).toContain("BYOA_TOKEN=your-token-here");
    expect(envExample).toContain("MEMORY_BACKEND=local");

    const mainFile = await readFile(
      path.join(targetDir, "src", "index.ts"),
      "utf8",
    );
    expect(mainFile).toContain("import { config } from 'dotenv';");
    expect(mainFile).toContain("import { Triologue } from 'triologue-sdk';");
    expect(mainFile).toContain(
      "this.name = process.env.AGENT_NAME || 'release-helper';",
    );
  });

  it("generates a JavaScript agent without TypeScript-only files", async () => {
    const targetDir = await createTempDir();
    const config = createConfig({
      name: "simple-agent",
      description: "Simple agent",
      features: {
        memory: false,
        triologue: false,
        skills: false,
      },
      options: {
        typescript: false,
        git: false,
        install: false,
      },
    });

    const generator = new AgentGenerator({
      targetDir,
      config,
    });

    await generator.generate();

    await expectFile(path.join(targetDir, "src", "index.js"));

    const packageJson = JSON.parse(
      await readFile(path.join(targetDir, "package.json"), "utf8"),
    ) as {
      main: string;
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };

    expect(packageJson.main).toBe("src/index.js");
    expect(packageJson.scripts.start).toBe("node src/index.js");
    expect(packageJson.scripts).not.toHaveProperty("build");
    expect(packageJson.devDependencies).toEqual({});

    const gitignore = await readFile(
      path.join(targetDir, ".gitignore"),
      "utf8",
    );
    expect(gitignore).not.toContain("dist/");

    await expectMissing(path.join(targetDir, "tsconfig.json"));
  });
});

async function createTempDir(): Promise<string> {
  const dirPath = await mkdtemp(path.join(os.tmpdir(), "agent-dev-kit-test-"));
  tempDirs.push(dirPath);
  return dirPath;
}

function createConfig(
  overrides: Partial<AgentConfig> & {
    name: string;
    description: string;
  },
): AgentConfig {
  return {
    name: overrides.name,
    description: overrides.description,
    features: overrides.features ?? {
      memory: false,
      triologue: false,
      skills: false,
    },
    options: overrides.options ?? {
      typescript: true,
      git: false,
      install: false,
    },
    metadata: overrides.metadata ?? {
      license: "MIT",
    },
  };
}

async function expectFile(filePath: string): Promise<void> {
  const fileStat = await stat(filePath);
  expect(fileStat.isFile()).toBe(true);
}

async function expectMissing(filePath: string): Promise<void> {
  await expect(stat(filePath)).rejects.toThrow();
}

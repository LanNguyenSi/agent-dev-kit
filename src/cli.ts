#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { AgentGenerator } from "./generators/agent.js";
import { parseFeatureFlags } from "./features.js";
import { FileUtils } from "./utils/files.js";
import { initializeGitRepository } from "./utils/git.js";
import type { AgentConfig } from "./types.js";

const execAsync = promisify(exec);

const program = new Command();

program
  .name("agent-dev")
  .description("CLI scaffolding tool for AI agent development")
  .version("0.1.0");

program
  .command("create <name>")
  .description("Create a new agent project")
  .option(
    "-f, --features <features>",
    "Comma-separated features: memory,triologue,skills",
  )
  .option("--no-git", "Skip git initialization")
  .option("--no-install", "Skip npm install")
  .option("--no-typescript", "Use JavaScript instead of TypeScript")
  .action(async (name: string, options) => {
    try {
      console.log(chalk.bold.blue(`\n🤖 Creating agent: ${name}\n`));

      const features = parseFeatureFlags(options.features);

      // Ask for confirmation if no features specified
      if (!options.features) {
        const answers = await inquirer.prompt([
          {
            type: "checkbox",
            name: "features",
            message: "Select features to include:",
            choices: [
              { name: "🧠 Memory System", value: "memory" },
              { name: "📡 Triologue Integration", value: "triologue" },
              { name: "🎯 Skills Framework", value: "skills" },
            ],
          },
          {
            type: "input",
            name: "description",
            message: "Agent description:",
            default: "AI Agent",
          },
        ]);

        Object.assign(features, parseFeatureFlags(answers.features.join(",")));
        options.description = answers.description;
      }

      // Create agent config
      const config: AgentConfig = {
        name,
        description: options.description || "AI Agent",
        features,
        options: {
          typescript: options.typescript !== false,
          git: options.git !== false,
          install: options.install !== false,
        },
        metadata: {
          license: "MIT",
        },
      };

      // Check if directory exists
      const targetDir = path.join(process.cwd(), name);
      const isEmpty = await FileUtils.isDirEmpty(targetDir);

      if (!isEmpty) {
        console.error(
          chalk.red(`\n❌ Directory ${name} already exists and is not empty\n`),
        );
        process.exit(1);
      }

      // Generate agent
      const generator = new AgentGenerator({
        targetDir,
        config,
        verbose: true,
      });

      await generator.generate();

      // Initialize git
      if (config.options.git) {
        console.log(chalk.gray("\nInitializing git repository..."));
        const gitResult = await initializeGitRepository(execAsync, targetDir);

        if (gitResult.committed) {
          console.log(chalk.green("✓ Git initialized with initial commit"));
        } else {
          console.log(chalk.yellow("⚠ Git initialized, initial commit skipped"));
          console.log(
            chalk.gray(
              "  Missing git identity. Configure it and create the first commit manually:",
            ),
          );
          if (gitResult.missingIdentity.includes("user.name")) {
            console.log(chalk.cyan('  git config --global user.name "Your Name"'));
          }
          if (gitResult.missingIdentity.includes("user.email")) {
            console.log(
              chalk.cyan('  git config --global user.email "you@example.com"'),
            );
          }
        }
      }

      // Install dependencies
      if (config.options.install) {
        console.log(chalk.gray("\nInstalling dependencies..."));
        await execAsync("npm install", { cwd: targetDir });
        console.log(chalk.green("✓ Dependencies installed"));
      }

      // Success message
      console.log(
        chalk.bold.green(`\n🎉 Agent ${name} created successfully!\n`),
      );
      console.log(chalk.gray("Next steps:"));
      console.log(chalk.cyan(`  cd ${name}`));
      if (!config.options.install) {
        console.log(chalk.cyan("  npm install"));
      }
      console.log(chalk.cyan("  npm test"));
      console.log(chalk.cyan("  npm run dev"));
      console.log(chalk.cyan("  cp .env.example .env"));
      console.log(chalk.cyan("  # Edit .env with your configuration"));
      if (config.options.typescript) {
        console.log(chalk.cyan("  npm run build"));
      }
      console.log(chalk.cyan("  npm start"));
      console.log();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error(chalk.red("\n❌ Error creating agent:"), message);
      process.exit(1);
    }
  });

program
  .command("add-feature <feature>")
  .description("Add a feature to existing agent")
  .action((feature: string) => {
    console.log(chalk.yellow("\n⚠️  add-feature not yet implemented\n"));
    console.log(
      chalk.gray("Coming soon: agent-dev add-feature memory|triologue|skills"),
    );
  });

program
  .command("generate-skill <name>")
  .description("Generate a new skill template")
  .action((name: string) => {
    console.log(chalk.yellow("\n⚠️  generate-skill not yet implemented\n"));
    console.log(chalk.gray(`Coming soon: agent-dev generate-skill ${name}`));
  });

await program.parseAsync();

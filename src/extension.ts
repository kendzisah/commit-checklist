// src/extension.ts

import * as vscode from 'vscode';
import { registerCommitCommand } from './commands/commitCommand';
import { registerSetGlobalChecklistCommand } from './commands/setGlobalChecklistCommand';

export function activate(context: vscode.ExtensionContext): void {
  registerCommitCommand(context);
  registerSetGlobalChecklistCommand(context);
}

export function deactivate(): void {
  // Cleanup if necessary
}
``;

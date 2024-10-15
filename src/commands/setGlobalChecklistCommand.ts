// src/commands/setGlobalChecklistCommand.ts

import * as vscode from 'vscode';
import { readJsonFile } from '../utils/fileUtils';
import { ChecklistGroup } from '../models/checklistModels';

export function registerSetGlobalChecklistCommand(context: vscode.ExtensionContext): void {
  const setGlobalChecklistCommand = vscode.commands.registerCommand('commitChecklist.setGlobalChecklist', async () => {
    const options: vscode.QuickPickItem[] = [
      { label: 'Enter JSON Content', description: 'Type or paste JSON content directly.' },
      { label: 'Select JSON File', description: 'Choose a JSON file from your file system.' },
    ];

    const selection = await vscode.window.showQuickPick(options, {
      placeHolder: 'How would you like to provide the commit checklist JSON?',
    });

    if (!selection) {
      return;
    }

    if (selection.label === 'Enter JSON Content') {
      const jsonInput = await vscode.window.showInputBox({
        prompt: 'Enter the JSON content for the commit checklist',
        placeHolder: 'Paste JSON content here',
      });

      if (jsonInput) {
        try {
          const parsedData = JSON.parse(jsonInput) as ChecklistGroup[];
          await context.globalState.update('globalChecklistData', parsedData);
          vscode.window.showInformationMessage('Global commit checklist has been set.');
        } catch (error: any) {
          vscode.window.showErrorMessage(`Invalid JSON input: ${error.message}`);
        }
      }
    } else if (selection.label === 'Select JSON File') {
      const files = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: 'Select',
        filters: { 'JSON files': ['json'] },
      });

      if (files && files.length > 0) {
        const fileUri = files[0];
        const parsedData = readJsonFile<ChecklistGroup[]>(fileUri.fsPath);
        if (parsedData) {
          await context.globalState.update('globalChecklistData', parsedData);
          vscode.window.showInformationMessage('Global commit checklist has been set from file.');
        } else {
          vscode.window.showErrorMessage('Failed to read or parse the selected JSON file.');
        }
      }
    }
  });

  context.subscriptions.push(setGlobalChecklistCommand);
}

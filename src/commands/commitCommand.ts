import * as vscode from 'vscode';
import { ChecklistService } from '../services/checklistService';
import { ChecklistGroup } from '../models/checklistModels';
import { ChecklistWebview } from '../ui/webviewProvider';

export function registerCommitCommand(context: vscode.ExtensionContext): void {
  const commitCommand = vscode.commands.registerCommand('commitChecklist.commitWithChecklist', async () => {
    const checklistService = new ChecklistService(context);

    if (!checklistService.loadChecklistData()) {
      return;
    }

    const checklistData = checklistService.getChecklistData();
    const checklistCompleted = await ChecklistWebview.showChecklist(context, checklistData);
    if (!checklistCompleted) {
      return;
    }

    // Proceed with the commit using the Git API
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    const git = gitExtension?.getAPI(1);

    if (!git) {
      vscode.window.showErrorMessage('Unable to access Git extension API.');
      return;
    }

    const repository = git.repositories[0];

    if (repository) {
      try {
        const commitMessage = await vscode.window.showInputBox({
          prompt: 'Commit message',
          placeHolder: 'Enter the commit message',
        });

        if (commitMessage) {
          await repository.commit(commitMessage);
          vscode.window.showInformationMessage('Commit successful.');
        } else {
          vscode.window.showErrorMessage('Commit aborted: No commit message provided.');
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(`Commit failed: ${error.message}`);
      }
    } else {
      vscode.window.showErrorMessage('No Git repository found.');
    }
  });

  context.subscriptions.push(commitCommand);
}

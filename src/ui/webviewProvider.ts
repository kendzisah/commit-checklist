import * as vscode from 'vscode';
import { ChecklistGroup } from '../models/checklistModels';
import { getWebviewContent } from './webviewContent';

export class ChecklistWebview {
  public static async showChecklist(
    context: vscode.ExtensionContext,
    checklistData: ChecklistGroup[]
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const panel = vscode.window.createWebviewPanel(
        'commitChecklist',
        'Commit Checklist',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: false,
        }
      );

      panel.webview.html = getWebviewContent(panel.webview, context, checklistData);

      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case 'submit':
              if (message.allChecked) {
                resolve(true);
                panel.dispose();
              }
              break;
            case 'showError':
              vscode.window.showErrorMessage(message.message);
              break;
          }
        },
        undefined,
        context.subscriptions
      );
    });
  }
}
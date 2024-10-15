import * as vscode from 'vscode';
import * as path from 'path';
import { ChecklistGroup } from '../models/checklistModels';
import { readJsonFile } from '../utils/fileUtils';

export class ChecklistService {
  private checklistData: ChecklistGroup[] = [];

  constructor(private context: vscode.ExtensionContext) {}

  public loadChecklistData(): boolean {
    this.checklistData = [];

    const config = vscode.workspace.getConfiguration('commitChecklist');
    const jsonFilePath = config.get<string>('jsonFilePath');

    if (jsonFilePath) {
      const filePath = path.isAbsolute(jsonFilePath)
        ? jsonFilePath
        : path.join(vscode.workspace.workspaceFolders?.[0].uri.fsPath || '', jsonFilePath);

      const data = readJsonFile<ChecklistGroup[]>(filePath);
      if (data) {
        this.checklistData = data;
        console.log('Loaded checklist data:', this.checklistData);
        return true;
      } else {
        vscode.window.showErrorMessage(`Failed to load commit checklist from file path: ${filePath}`);
        return false;
      }
    }

    const storedChecklistData = this.context.globalState.get<ChecklistGroup[]>('globalChecklistData');
    if (storedChecklistData) {
      this.checklistData = storedChecklistData;
      return true;
    }

    vscode.window.showErrorMessage(
      'No valid commit checklist found. Please set it using the extension settings or the "Set Global Commit Checklist" command.'
    );
    return false;
  }

  public getChecklistData(): ChecklistGroup[] {
    return this.checklistData;
  }
}

import { selectImageCommandCallback } from './commands/select-image';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('adityaguptadev-walltheme.chooseTheme', selectImageCommandCallback);

	context.subscriptions.push(disposable);
}

export function deactivate() { }
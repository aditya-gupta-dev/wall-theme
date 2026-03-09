import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "adityaguptadev-walltheme" is now active!');

	const disposable = vscode.commands.registerCommand('adityaguptadev-walltheme.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from .!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

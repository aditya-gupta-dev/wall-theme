import * as vscode from 'vscode';
import { tryCatch } from '../utils/result';

const imagePickerOptions: vscode.OpenDialogOptions = {
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    filters: {
        "Image": ['png', 'jpg']
    },
    title: "Choose Image",
};

export async function selectImageCommandCallback() {
    const { data, err } = await tryCatch(chooseImageAndApplyTheme(imagePickerOptions)); 

    if (err) {
        vscode.window.showErrorMessage(err.message); 
        return; 
    }
}

async function chooseImageAndApplyTheme(options: vscode.OpenDialogOptions): Promise<string> {
    vscode.window.showInformationMessage('pick your image');
    const selectedFiles: vscode.Uri[] | undefined = await vscode.window.showOpenDialog(imagePickerOptions);

    if (!selectedFiles) {
        throw new Error("select at least one image");
    }
    
    return selectedFiles[0].fsPath;
}
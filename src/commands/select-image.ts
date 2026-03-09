import * as vscode from 'vscode';
import { tryCatch } from '../utils/result';
import { Vibrant } from "node-vibrant/node"; 

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
    const { data, err } = await tryCatch(pickImageTry(imagePickerOptions));

    if (err) {
        vscode.window.showErrorMessage(err.message);
        return;
    }

    await generateThemeTry(data); 
}

async function pickImageTry(options: vscode.OpenDialogOptions): Promise<string> {
    vscode.window.showInformationMessage('pick your image');
    const selectedFiles: vscode.Uri[] | undefined = await vscode.window.showOpenDialog(options);

    if (!selectedFiles) {
        throw new Error("no image was selected.");
    }

    return selectedFiles[0].fsPath;
}

async function generateThemeTry(imagePath: string) {

    const { data, err } = await tryCatch(Vibrant.from(imagePath).getPalette()); 

    if(err) { 
        throw err; 
    }
    
    console.log(data); 

    const colors = {
        "editor.background": data.DarkMuted?.hex,
        "activityBar.background": data.DarkVibrant?.hex,
        "sideBar.background": data.LightMuted?.hex,
        "statusBar.background": data.LightVibrant?.hex,
        "button.background": data.Muted?.hex
    };

    const config = vscode.workspace.getConfiguration();

    await config.update(
        "workbench.colorCustomizations",
        colors,
        vscode.ConfigurationTarget.Global
    );

    vscode.window.showInformationMessage(
        "Theme generated from image and applied!"
    );

}
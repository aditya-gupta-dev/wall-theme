import * as vscode from 'vscode';
import { tryCatch } from '../utils/result';
// import Colorthief from "colorthief";

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
        throw new Error("select at least one image");
    }

    return selectedFiles[0].fsPath;
}

async function generateThemeTry(imagePath: string) {
    // const palette = await Colorthief.getPalette(imagePath);

    // if (!palette) {
    //     throw new Error("failed to get color palette");
    // }

    const colors = {
        "editor.background": "#000000",
        "activityBar.background": "#000000",
        "sideBar.background": "#000000",
        "statusBar.background": "#000000",
        "button.background": "#000000"
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
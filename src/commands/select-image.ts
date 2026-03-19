import * as vscode from 'vscode';
import { tryCatch } from '../utils/result';
import fs from "fs/promises";
import path from 'path';
import os from "os";
import { isFileExists } from '../utils/fs';
import { getPalette, Color } from "../lib/";

const imagePickerOptions: vscode.OpenDialogOptions = {
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    filters: {
        "Image": ['png', 'jpg']
    },
    title: "Choose Image",
};

const themeFilePath = "./themes/generated-theme.json";

export async function selectImageCommandCallback() {
    const imagePickResult = await tryCatch(pickImageTry(imagePickerOptions));

    if (imagePickResult.err) {
        vscode.window.showErrorMessage(imagePickResult.err.message);
        return;
    }

    const generateThemeResult = await tryCatch(generateThemeTry(imagePickResult.data));

    if (generateThemeResult.err) {
        vscode.window.showErrorMessage(generateThemeResult.err.message);
        return;
    }

    const updateThemeFileResult = await tryCatch(updateThemeFileTry(generateThemeResult.data));

    if (updateThemeFileResult.err) {
        vscode.window.showErrorMessage(updateThemeFileResult.err.message);
        return;
    }

    // await updateEditorTheme();
}

async function pickImageTry(options: vscode.OpenDialogOptions): Promise<string> {
    vscode.window.showInformationMessage('pick your image');
    const selectedFiles: vscode.Uri[] | undefined = await vscode.window.showOpenDialog(options);

    if (!selectedFiles) {
        throw new Error("no image was selected.");
    }

    return selectedFiles[0].fsPath;
}

async function generateThemeTry(imagePath: string): Promise<Color[] | null> {
    console.log("generating theme...");

    getPalette(imagePath).then((val) => console.log('something: ', val)); 

    const { data: palette, err } = await tryCatch(getPalette(imagePath));
    if (err) {
        throw err;
    }

    console.log("generated-theme: ", palette);
    return palette;
}

async function updateThemeFileTry(palette: Color[] | null) {

    const filePath = path.join(os.homedir(), ".config", "Code", themeFilePath);

    if (!(await isFileExists(filePath))) {
        await fs.open(filePath, 'w');
    }

    const { err } = await tryCatch(
        fs.writeFile(
            filePath,
            JSON.stringify(palette, null, 2),
        )
    );

    if (err) {
        throw err;
    }
}

async function updateEditorTheme() {
    const config = vscode.workspace.getConfiguration();

    await config.update(
        "workbench.colorCustomizations",
        "Image Theme",
        true
    );

    vscode.window.showInformationMessage(
        "Theme generated from image and applied!"
    );
}
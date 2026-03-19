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

export function selectImageCommandCallback(context: vscode.ExtensionContext) {
    return async () => {
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

        const updateThemeFileResult = await tryCatch(updateThemeFileTry(context, generateThemeResult.data));

        if (updateThemeFileResult.err) {
            vscode.window.showErrorMessage(updateThemeFileResult.err.message);
            return;
        }

        // await updateEditorTheme();
    };
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
    console.log("generating theme for image:", imagePath);

    const { data: palette, err } = await tryCatch(getPalette(imagePath));
    
    console.log("getPalette returned");

    if (err) {
        console.error("Error generating palette:", err);
        throw err;
    }

    console.log("generated-theme: ", palette);
    return palette;
}

async function updateThemeFileTry(context: vscode.ExtensionContext, palette: Color[] | null) {
    const filePath = path.join(context.extensionPath, 'themes', 'generated-theme.json');

    try {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(
            filePath,
            JSON.stringify(palette, null, 2),
        );
    } catch (err) {
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
import { FunctionCall } from '@google/genai';
import { FunctionCallResponseOutput } from './types';
import * as fileService from '../services/fileService';
import * as folderService from '../services/folderService';

const executeFunctionCall = async (
  functionCall: FunctionCall,
  userId: number,
  currentFolderId: number | null
): Promise<FunctionCallResponseOutput> => {
  let error: string | undefined = undefined;
  let output: Record<string, any> = {};
  let message: string = '';

  try {
    const functionName = functionCall.name;
    const args = functionCall.args || ({} as Record<string, any>);

    switch (functionName) {
      case 'getFile': {
        const { fileName, parentFolderId } = args;
        const file = await fileService.findFile(
          userId,
          fileName as string,
          parentFolderId as number | null | undefined
        );
        output = file || {};
        message = file
          ? `Found file: ${fileName}`
          : `File ${fileName} not found`;
        if (!file) error = 'File not found';
        break;
      }

      case 'getFolder': {
        const { folderName, parentFolderId } = args;

        const folder = await folderService.findFolder(
          userId,
          folderName as string,
          parentFolderId as number | null | undefined
        );
        output = folder || {};
        message = folder
          ? `Found folder: ${folderName}`
          : `Folder ${folderName} not found`;
        if (!folder) error = 'Folder not found';
        break;
      }

      case 'createFolder': {
        const { folderName, parentFolderId = currentFolderId } = args;
        const folder = await folderService.createFolder(
          userId,
          folderName as string,
          parentFolderId as number | null
        );
        output = folder;
        message = `Created folder: ${folderName}`;
        break;
      }

      case 'deleteFile': {
        const { fileId } = args;
        await fileService.deleteFiles([Number(fileId)]);
        message = `Deleted file with id: ${fileId}`;
        break;
      }

      case 'deleteFolder': {
        const { folderId } = args;
        await folderService.deleteFolders([Number(folderId)]);
        message = `Deleted folder with id: ${folderId}`;
        break;
      }

      case 'renameFile': {
        const { fileId, newFileName } = args;
        const file = await fileService.renameFile(
          Number(fileId),
          newFileName as string
        );
        output = file;
        message = `Renamed file to: ${newFileName}`;
        break;
      }

      case 'renameFolder': {
        const { folderId, newFolderName } = args;
        const folder = await folderService.renameFolder(
          Number(folderId),
          newFolderName as string
        );
        output = folder;
        message = `Renamed folder to: ${newFolderName}`;
        break;
      }

      case 'listFiles': {
        const { folderId = currentFolderId, search } = args;
        const files = await fileService.getFiles(
          userId,
          folderId as number | null
        );

        output = { files };
        message = `Found ${files.length} files`;
        break;
      }

      case 'listFolders': {
        const { folderId = currentFolderId, search } = args;
        const folders = await folderService.getFolders(
          userId,
          folderId as number | null
        );

        output = { folders };
        message = `Found ${folders.length} folders`;
        break;
      }

      case 'moveFile': {
        const { fileId, destinationFolderId } = args;
        await fileService.moveFiles([
          {
            fileId: Number(fileId),
            newFolderId: destinationFolderId as number | null,
          },
        ]);
        message = `Moved file with id: ${fileId} to folder: ${destinationFolderId}`;
        break;
      }

      case 'moveFolder': {
        const { folderId, destinationFolderId } = args;
        await folderService.moveFolders([
          {
            folderId: Number(folderId),
            newFolderId: destinationFolderId as number | null,
          },
        ]);
        message = `Moved folder with id: ${folderId} to folder: ${destinationFolderId}`;
        break;
      }

      case 'cloneFile': {
        const { fileId } = args;
        const clonedFiles = await fileService.cloneFiles([Number(fileId)]);
        output = clonedFiles[0];
        message = `File with id ${fileId} was cloned. Id of cloned file is ${clonedFiles[0].id}`;
        break;
      }

      case 'cloneFolder': {
        const { folderId } = args;
        const clonedFolders = await folderService.cloneFolders([
          Number(folderId),
        ]);
        output = clonedFolders[0];
        message = `Folder with id ${folderId} was cloned. Id of cloned folder is ${clonedFolders[0].id}`;
        break;
      }

      case 'getFileShareableLink': {
        const { fileId } = args;
        const url = await fileService.getFileUrl(Number(fileId));
        output = { url };
        message = `Generated shareable link for file: ${fileId}`;
        break;
      }

      default:
        error = `Unknown function: ${functionName}`;
    }
  } catch (e: any) {
    error = `An error occurred: ${e.message}`;
    console.error(`Error executing function ${functionCall.name}: `, e);
  }

  return {
    message,
    output,
    error,
  };
};

export default executeFunctionCall;

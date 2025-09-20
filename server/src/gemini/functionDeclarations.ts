import { FunctionDeclaration, Type } from '@google/genai';

const FUNCTION_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: 'getFile',
    description:
      'Returns file object (with id property inside) for a given file name and optional parent folder name. It can and should be used when you have the file name and you need its id',
    parameters: {
      type: Type.OBJECT,
      properties: {
        fileName: {
          type: Type.STRING,
          description: 'Name of the file to get id for.',
        },
        parentFolderId: {
          type: Type.INTEGER,
          description:
            'Id of the folder where the file is located (optional). For root/home folder, pass null (as JSON null value, not a string "null"). When not provided, we will look across all folders.',
          nullable: true,
        },
      },
      required: ['fileName'],
      propertyOrdering: ['fileName', 'parentFolderId'],
    },
    response: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        name: { type: Type.STRING },
        folderId: { type: Type.INTEGER },
        ownerId: { type: Type.INTEGER },
        mimeType: { type: Type.STRING },
        path: { type: Type.STRING },
        bucket: { type: Type.STRING },
        size: { type: Type.INTEGER },
        isFavorite: { type: Type.BOOLEAN },
        createdAt: { type: Type.STRING, description: 'ISO string date format' },
        updatedAt: { type: Type.STRING, description: 'ISO string date format' },
      },
    },
  },
  {
    name: 'getFolder',
    description:
      'Returns folder object (with id property inside) for a given folder name and optional parent folder name. It should be used when you need folder id',
    parameters: {
      type: Type.OBJECT,
      properties: {
        folderName: {
          type: Type.STRING,
          description:
            'Name of the folder to get object details for. Must be non-empty string',
        },
        parentFolderId: {
          type: Type.INTEGER,
          description:
            'Id of the folder where the folder is located (optional). For root/home folder, pass null (as JSON null value, not a string "null").',
          nullable: true,
        },
      },
      required: ['folderName'],
      propertyOrdering: ['folderName', 'parentFolderId'],
    },
    response: {
      type: Type.OBJECT,
      properties: {
        parentFolderId: { type: Type.INTEGER },
        id: { type: Type.INTEGER },
        name: { type: Type.STRING },
        ownerId: { type: Type.INTEGER },
        isFavorite: { type: Type.BOOLEAN },
        createdAt: { type: Type.STRING, description: 'ISO string date format' },
        updatedAt: { type: Type.STRING, description: 'ISO string date format' },
      },
    },
  },
  {
    name: 'createFolder',
    description:
      'Creates a folder and returns the created folder object (with id property inside).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        folderName: {
          type: Type.STRING,
          description: 'Name of the folder to create.',
        },
        parentFolderId: {
          type: Type.INTEGER,
          description:
            'Id of the parent folder. For root/main/home folder, pass null (as JSON null value, not a string "null"). If there is no mention of parent folder to save new folder into, then use current folder id from SYSTEM INSTRUCTION',
          nullable: true,
        },
      },
      required: ['folderName', 'parentFolderId'],
      propertyOrdering: ['folderName', 'parentFolderId'],
    },
  },
  {
    name: 'deleteFile',
    description: 'Deletes a file by fileId',
    parameters: {
      type: Type.OBJECT,
      properties: {
        fileId: { type: Type.INTEGER, description: 'Id of file to delete.' },
      },
      required: ['fileId'],
    },
  },
  {
    name: 'deleteFolder',
    description: 'Deletes a folder by folderId',
    parameters: {
      type: Type.OBJECT,
      properties: {
        folderId: {
          type: Type.INTEGER,
          description: 'Id of folder to delete.',
        },
      },
      required: ['folderId'],
    },
  },
  {
    name: 'renameFile',
    description: 'Renames a file by fileId.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        fileId: { type: Type.INTEGER, description: 'Id of file to rename.' },
        newFileName: {
          type: Type.STRING,
          description: 'New name for the file.',
        },
      },
      required: ['fileId', 'newFileName'],
    },
  },
  {
    name: 'renameFolder',
    description: 'Renames a folder by folderId.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        folderId: {
          type: Type.INTEGER,
          description:
            'Id of folder to rename. This time it can not be null because the root/main/home folder can not be modified',
        },
        newFolderName: {
          type: Type.STRING,
          description: 'New name for the file. Can not be empty',
        },
      },
      required: ['folderId', 'newFolderName'],
    },
  },
  {
    name: 'listFiles',
    description: 'Returns a list of file objects',
    parameters: {
      type: Type.OBJECT,
      properties: {
        folderId: {
          type: Type.INTEGER,
          description:
            'Id of folder to list files from. For root/home folder, pass null (as JSON null value, not a string "null"). When undefined, we will get files from all folders.',
          nullable: true,
        },
        search: {
          type: Type.STRING,
          description: 'Search input to filter files by',
        },
      },
      propertyOrdering: ['folderId', 'search'],
    },
  },
  {
    name: 'listFolders',
    description: 'Returns a list of folder objects',
    parameters: {
      type: Type.OBJECT,
      properties: {
        folderId: {
          type: Type.INTEGER,
          description:
            'Id of folder to list folders from. For root/home folder, pass null (as JSON null value, not a string "null"). When undefined, we will get folders from all folders.',
          nullable: true,
        },
        search: {
          type: Type.STRING,
          description: 'Search input to filter folders by',
        },
      },
      required: [],
      propertyOrdering: ['folderId', 'search'],
    },
  },
  {
    name: 'moveFile',
    description: 'Moves a file to a destination folder.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        fileId: { type: Type.INTEGER, description: 'Id of file to move' },
        destinationFolderId: {
          type: Type.INTEGER,
          description:
            'Id of the destination folder. For root/home folder, pass null (as JSON null value, not a string "null").',
          nullable: true,
        },
      },
      required: ['fileId', 'destinationFolderId'],
      propertyOrdering: ['fileId', 'destinationFolderId'],
    },
  },
  {
    name: 'moveFolder',
    description: 'Moves a folder to another destination folder.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        folderId: { type: Type.INTEGER, description: 'Id of folder to move' },
        destinationFolderId: {
          type: Type.INTEGER,
          description:
            'Id of the destination folder. For root/home folder, pass null (as JSON null value, not a string "null").',
          nullable: true,
        },
      },
      required: ['folderId', 'destinationFolderId'],
      propertyOrdering: ['folderId', 'destinationFolderId'],
    },
  },
  {
    name: 'cloneFile',
    description: 'Clones a file in the same folder',
    parameters: {
      type: Type.OBJECT,
      properties: {
        fileId: { type: Type.INTEGER, description: 'Id of file to clone' },
      },
      required: ['fileId'],
    },
  },
  {
    name: 'cloneFolder',
    description: 'Clones a folder in the same folder',
    parameters: {
      type: Type.OBJECT,
      properties: {
        folderId: { type: Type.INTEGER, description: 'Id of folder to clone' },
      },
      required: ['folderId'],
    },
  },
  {
    name: 'getFileShareableLink',
    description: 'Gets presigned url for a file by its id',
    parameters: {
      type: Type.OBJECT,
      properties: {
        fileId: {
          type: Type.INTEGER,
          description: 'Id of file to get presigned url from',
        },
      },
      required: ['fileId'],
    },
  },
];

export default FUNCTION_DECLARATIONS;

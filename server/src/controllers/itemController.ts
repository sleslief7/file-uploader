import asyncHandler from 'express-async-handler';
import {
  CloneFileDto,
  CloneFolderDto,
  GetItemsQueryParams,
  getItemsQueryParamsSchema,
  MoveFileDto,
  MoveFolderDto,
} from '../interfaces';
import * as itemService from '../services/itemService';

export const getItemsHandler = asyncHandler(async (req, res) => {
  const params: GetItemsQueryParams = getItemsQueryParamsSchema.parse(
    req.query
  );

  const userId = req.user!.id;

  const response = await itemService.getItems(userId, params);

  res.status(200).json(response);
});

export const moveItemsHandler = asyncHandler(async (req, res) => {
  const moveFolderDtos = req.body.foldersToMove as MoveFolderDto[];
  const moveFileDtos = req.body.filesToMove as MoveFileDto[];

  await itemService.moveItems(moveFolderDtos, moveFileDtos);

  res.status(200).send();
});

export const cloneItemsHandler = asyncHandler(async (req, res) => {
  const cloneFolderDtos = req.body.foldersToClone as CloneFolderDto[];
  const cloneFileDtos = req.body.filesToClone as CloneFileDto[];

  await itemService.cloneItems(cloneFolderDtos, cloneFileDtos);

  res.status(200).send();
});

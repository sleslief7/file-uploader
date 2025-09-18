import asyncHandler from 'express-async-handler';
import {
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

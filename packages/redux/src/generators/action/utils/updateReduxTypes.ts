import { readFileIfExisting } from 'nx/src/project-graph/file-utils';
import { Tree } from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedSchema } from '../generator';

export const updateReduxTypes = (tree: Tree, options: NormalizedSchema) => {
  const targetFilePath = path.join(options.projectRoot, '/src/index.ts');
  let content = readFileIfExisting(targetFilePath);
  content = addNewAction(content, options.actionName);
  if (options.includesLoader)
    content = addNewAction(content, `${options.actionName}_Loading`);
  if (options.includesError)
    content = addNewAction(content, `${options.actionName}_Error`);
  tree.write(targetFilePath, content);
};
const addNewAction = (content: string, actionName: string): string => {
  content = importActionInterface(content, actionName);
  content = importReducer(content, actionName);
  content = updateActionTypesEnum(content, actionName);
  content = updateAction(content, actionName);
  content = updateCombinedReducer(content, actionName);
  return content;
};

const updateActionTypesEnum = (content: string, actionName: string): string => {
  const replacementAnchorString = 'export enum ACTION_TYPES {';
  const newContent = `\n${actionName.toUpperCase()}="${actionName.toUpperCase()}",`;
  content = content.replace(
    replacementAnchorString,
    `${replacementAnchorString}${newContent}`
  );
  return content;
};
const updateAction = (content: string, actionName: string): string => {
  const replacementRegex = new RegExp(`export type Action *= *[ \n|]*`);
  const newContent = ` ${actionName}Interface |`;
  content = content.replace(
    replacementRegex,
    `export type Action =${newContent}`
  );
  return content;
};
const importActionInterface = (content: string, actionName: string): string => {
  const replacementAnchorString = 'ACTION--INTERFACE--IMPORTS';
  const newContent = `\nimport {${actionName}Interface} from "./${actionName}";`;
  content = content.replace(
    replacementAnchorString,
    `${replacementAnchorString}${newContent}`
  );
  return content;
};
const importReducer = (content: string, actionName: string): string => {
  const replacementAnchorString = 'REDUCER--IMPORTS';
  const newContent = `\nimport {${actionName}Reducer} from "./${actionName}";`;
  content = content.replace(
    replacementAnchorString,
    `${replacementAnchorString}${newContent}`
  );
  return content;
};

const updateCombinedReducer = (content: string, actionName: string): string => {
  const replacementAnchorString = 'const conjoinedReducers = {';
  const newContent = `\n${actionName}: ${actionName}Reducer,`;
  content = content.replace(
    replacementAnchorString,
    `${replacementAnchorString}${newContent}`
  );
  return content;
};

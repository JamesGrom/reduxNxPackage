import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { Tree } from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedSchema } from '../generator';

export const updateReduxTypes = (tree: Tree, options: NormalizedSchema) => {
  const targetFilePath = path.join(options.projectRoot, '/src/index.ts');
  let content = readFileIfExisting(targetFilePath);
  content = addNewAction(
    content,
    options.actionClassName,
    options.actionConstName,
    options.actionFileName,
    options.includesReducer,
    options.reducedStateName
  );
  if (options.includesLoader)
    content = addNewAction(
      content,
      options.loaderName!,
      options.loaderConstName!,
      options.loaderFileName!,
      true
    );
  if (options.includesError)
    content = addNewAction(
      content,
      options.errorName!,
      options.errorConstName,
      options.errorFileName!,
      true
    );
  tree.write(targetFilePath, content);
};
const addNewAction = (
  content: string,
  actionClassName: string,
  actionConstName: string,
  actionFileName: string,
  includesReducer: boolean,
  reducedStateName?: string
): string => {
  content = importActionInterface(content, actionClassName, actionFileName);
  if (includesReducer)
    content = importReducer(content, actionClassName, actionFileName);
  content = updateActionTypesEnum(content, actionConstName);
  content = updateAction(content, actionClassName);
  if (includesReducer)
    content = updateCombinedReducer(content, actionClassName, reducedStateName);
  return content;
};

const updateActionTypesEnum = (
  content: string,
  actionConstName: string
): string => {
  const replacementAnchorString = 'export enum ACTION_TYPES {';
  const newContent = `\n${actionConstName}="${actionConstName}",`;
  content = content.replace(
    replacementAnchorString,
    `${replacementAnchorString}${newContent}`
  );
  return content;
};
const updateAction = (content: string, actionClassName: string): string => {
  const replacementRegex = new RegExp(`export type Action *= *[ \t\n|]*`);
  const newContent = ` ${actionClassName}Interface |`;
  content = content.replace(
    replacementRegex,
    `export type Action =${newContent}`
  );
  return content;
};
const importActionInterface = (
  content: string,
  actionClassName: string,
  actionFileName: string
): string => {
  const replacementAnchorString = 'ACTION--INTERFACE--IMPORTS';
  const newContent = `\nimport {${actionClassName}Interface} from "./${actionFileName}";`;
  content = content.replace(
    replacementAnchorString,
    `${replacementAnchorString}${newContent}`
  );
  return content;
};
const importReducer = (
  content: string,
  actionClassName: string,
  actionFileName: string
): string => {
  const replacementAnchorString = 'REDUCER--IMPORTS';
  const newContent = `\nimport {${actionClassName}Reducer} from "./${actionFileName}";`;
  content = content.replace(
    replacementAnchorString,
    `${replacementAnchorString}${newContent}`
  );
  return content;
};

const updateCombinedReducer = (
  content: string,
  actionClassName: string,
  reducedStateName?: string
): string => {
  const replacementAnchorString = 'const conjoinedReducers = {';
  const newContent = `\n${
    reducedStateName ?? actionClassName
  }: ${actionClassName}Reducer,`;
  content = content.replace(
    replacementAnchorString,
    `${replacementAnchorString}${newContent}`
  );
  return content;
};

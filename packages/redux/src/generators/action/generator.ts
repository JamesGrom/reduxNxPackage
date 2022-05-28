import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { uppercase } from './utils/uppercase';
import { updateReduxTypes } from './utils/updateReduxTypes';
import * as path from 'path';
import { ActionGeneratorSchema } from './schema';
import { generateLoaderAction } from './loaderGenerator/generator';
import { generateErrorAction } from './errorGenerator/generator';

export interface NormalizedSchema extends ActionGeneratorSchema {
  actionRoot: string;
  actionFileName: string;
  actionClassName: string;
  actionConstName: string;
  loaderName?: string;
  loaderConstName?: string;
  errorName?: string;
  errorConstName?: string;
  projectRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: ActionGeneratorSchema
): NormalizedSchema {
  const nameOfAction = names(options.actionName).fileName;
  const actionFileName = names(options.actionName).fileName;
  const actionClassName = names(options.actionName).className;
  const actionConstName = names(options.actionName).constantName;
  const actionName = nameOfAction.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${
    options.parentLibraryName
  }`;
  const loaderName = options.includesLoader
    ? `${actionClassName}Loading`
    : undefined;
  const loaderConstName = options.includesLoader
    ? `${actionConstName}_LOADING`
    : undefined;
  const errorName = options.includesError
    ? `${actionClassName}Error`
    : undefined;
  const errorConstName = options.includesError
    ? `${actionConstName}_ERROR`
    : undefined;
  const actionRoot = projectRoot + `/src`;
  return {
    ...options,
    loaderConstName,
    errorConstName,
    projectRoot,
    actionName,
    actionConstName,
    actionClassName,
    actionFileName,
    loaderName,
    errorName,
    actionRoot,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const fileDestination = options.actionRoot;
  const templateOptions = {
    ...options,
    ...names(options.actionName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'action'), fileDestination, {
    ...templateOptions,
    uppercase,
  });
}
export default async function (tree: Tree, options: ActionGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  updateReduxTypes(tree, normalizedOptions);
  if (normalizedOptions.includesLoader === true)
    await generateLoaderAction(tree, normalizedOptions);
  if (normalizedOptions.includesError === true)
    await generateErrorAction(tree, normalizedOptions);
  await formatFiles(tree);
}

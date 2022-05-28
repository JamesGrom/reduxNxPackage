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
  loaderName?: string;
  errorName?: string;
  projectRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: ActionGeneratorSchema
): NormalizedSchema {
  const nameOfAction = names(options.actionName).fileName;
  const actionName = nameOfAction.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${
    options.parentLibraryName
  }`;
  const loaderName = options.includesLoader
    ? `${options.actionName}_Loading`
    : undefined;
  const errorName = options.includesError
    ? `${options.actionName}_Error`
    : undefined;
  const actionRoot = projectRoot + `/src`;
  return {
    ...options,
    projectRoot,
    actionName,
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

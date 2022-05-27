import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { updateActionTypes } from './utils/updateActionTypes';
import * as path from 'path';
import { ActionGeneratorSchema } from './schema';
import { updateActionInterfaces } from './utils/updateActionInterfaces';

export interface NormalizedSchema extends ActionGeneratorSchema {
  actionRoot: string;
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
  const actionRoot = projectRoot + `/src`;
  return {
    ...options,
    projectRoot,
    actionName,
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
  generateFiles(tree, path.join(__dirname, 'files'), fileDestination, {
    ...templateOptions,
    uppercase,
  });
}
function uppercase(val: string) {
  return val.toUpperCase();
}
export default async function (tree: Tree, options: ActionGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  updateActionTypes(tree, normalizedOptions);
  updateActionInterfaces(tree, normalizedOptions);
  await formatFiles(tree);
}

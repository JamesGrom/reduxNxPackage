import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { uppercase } from './utils/uppercase';
import { updateActionInterfaces } from './utils/updateActionInterfaces';
import * as path from 'path';
import { ActionGeneratorSchema } from './schema';

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
  generateFiles(tree, path.join(__dirname, 'action'), fileDestination, {
    ...templateOptions,
    uppercase,
  });
}
export default async function (tree: Tree, options: ActionGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  updateActionInterfaces(tree, normalizedOptions);
  await formatFiles(tree);
}

import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { ReduxGeneratorSchema } from './schema';

interface NormalizedSchema extends ReduxGeneratorSchema {
  actionRoot: string;
  projectRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: ReduxGeneratorSchema
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
export default async function (tree: Tree, options: ReduxGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

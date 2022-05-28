import {
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { uppercase } from '../utils/uppercase';
import { NormalizedSchema } from '../generator';
import * as path from 'path';
export const generateLoaderAction = async (
  tree: Tree,
  options: NormalizedSchema
) => {
  addLoaderFiles(tree, options);
  await formatFiles(tree);
};
export function addLoaderFiles(tree: Tree, options: NormalizedSchema) {
  const fileDestination = options.actionRoot;
  const templateOptions = {
    ...options,
    ...names(options.actionName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, '../loaderAction'),
    fileDestination,
    {
      ...templateOptions,
      uppercase,
    }
  );
}

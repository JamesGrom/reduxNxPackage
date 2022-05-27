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
import { updateActionInterfaces } from '../utils/updateActionInterfaces';
export const generateLoaderAction = async (
  tree: Tree,
  options: NormalizedSchema
) => {
  const loaderName = `${options.actionName}_Loading`;
  addLoaderFiles(tree, options, loaderName);
  updateActionInterfaces(tree, { ...options, actionName: loaderName });
  await formatFiles(tree);
};
export function addLoaderFiles(
  tree: Tree,
  options: NormalizedSchema,
  loaderName: string
) {
  const fileDestination = options.actionRoot;
  const templateOptions = {
    ...options,
    ...names(options.actionName),
    loaderName,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'loaderAction'), fileDestination, {
    ...templateOptions,
    uppercase,
  });
}

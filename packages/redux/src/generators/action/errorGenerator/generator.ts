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
export const generateErrorAction = async (
  tree: Tree,
  options: NormalizedSchema
) => {
  addErrorFiles(tree, options);
  await formatFiles(tree);
};
export function addErrorFiles(tree: Tree, options: NormalizedSchema) {
  const fileDestination = options.actionRoot;
  const templateOptions = {
    ...options,
    ...names(options.actionName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, '../errorAction'), fileDestination, {
    ...templateOptions,
    uppercase,
  });
}

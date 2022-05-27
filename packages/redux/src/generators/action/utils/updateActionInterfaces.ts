import { readFileIfExisting } from 'nx/src/project-graph/file-utils';
import { names, Tree } from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedSchema } from '../generator';

// const actionTypesModule = readFileIfExisting();
export const updateActionInterfaces = (
  tree: Tree,
  options: NormalizedSchema
) => {
  const actionTypeModulePath = path.join(options.projectRoot, '/src/index.ts');
  const actionTypeModule = readFileIfExisting(actionTypeModulePath);
  console.log(actionTypeModule);
  const toInsert = `import {${options.actionName}Interface} from "./${options.actionName}";`;
  const withNewInterface = actionTypeModule.replace(
    'noopInterface;',
    `${options.actionName}Interface | noopInterface;`
  );
  const newContent = `${toInsert}${withNewInterface}`;
  tree.write(actionTypeModulePath, newContent);
};

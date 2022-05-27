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
  let content = actionTypeModule;
  const toInsertIntoImport = `import {${options.actionName}Interface} from "./${options.actionName}";\n`;
  content = `${toInsertIntoImport}${content}`;
  const toInsertIntoEnum = `\n${options.actionName.toUpperCase()}="${options.actionName.toUpperCase()}",\n`;
  content = content.replace(
    'ACTION_TYPES {',
    `ACTION_TYPES { ${toInsertIntoEnum}`
  );
  content = content.replace(
    'noopInterface;',
    `${options.actionName}Interface | noopInterface;`
  );
  tree.write(actionTypeModulePath, content);
};

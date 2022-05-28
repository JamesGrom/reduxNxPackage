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
  const toInsertIntoEnum = `\n${options.actionName.toUpperCase()}="${options.actionName.toUpperCase()}",`;
  content = content.replace(
    'ACTION_TYPES {',
    `ACTION_TYPES { ${toInsertIntoEnum}`
  );
  content = content.replace(
    'noopInterface;',
    `${options.actionName}Interface | noopInterface;`
  );
  if (options.includesLoader) content = includeNewLoader(content, options);
  if (options.includesError) content = includeNewError(content, options);
  tree.write(actionTypeModulePath, content);
};

const includeNewLoader = (inputContent: string, options: NormalizedSchema) => {
  let outputContent: string = inputContent;
  const toInsertIntoImport = `import {${options.loaderName}Interface} from "./${options.loaderName}";\n`;
  outputContent = `${toInsertIntoImport}${outputContent}`;
  const toInsertIntoEnum = `\n${options.loaderName.toUpperCase()}="${options.loaderName.toUpperCase()}",`;
  outputContent = outputContent.replace(
    'ACTION_TYPES {',
    `ACTION_TYPES { ${toInsertIntoEnum}`
  );
  outputContent = outputContent.replace(
    'noopInterface;',
    `${options.loaderName}Interface | noopInterface;`
  );
  return outputContent;
};

const includeNewError = (inputContent: string, options: NormalizedSchema) => {
  let outputContent: string = inputContent;
  const toInsertIntoImport = `import {${options.errorName}Interface} from "./${options.errorName}";\n`;
  outputContent = `${toInsertIntoImport}${outputContent}`;
  const toInsertIntoEnum = `\n${options.errorName.toUpperCase()}="${options.errorName.toUpperCase()}",`;
  outputContent = outputContent.replace(
    'ACTION_TYPES {',
    `ACTION_TYPES { ${toInsertIntoEnum}`
  );
  outputContent = outputContent.replace(
    'noopInterface;',
    `${options.errorName}Interface | noopInterface;`
  );
  return outputContent;
};

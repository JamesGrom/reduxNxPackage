import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { Tree } from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedSchema } from '../generator';

export const updateActionCreators = (tree: Tree, options: NormalizedSchema) => {
  const targetFilePath = path.join(
    options.projectRoot,
    '/src/actionCreators.ts'
  );
  let content = readFileIfExisting(targetFilePath);
  content = exportNewActionCreator(
    content,
    options.actionClassName,
    options.actionFileName,
    false
  );
  if (options.includesLoader)
    content = exportNewActionCreator(
      content,
      options.loaderName,
      options.loaderFileName,
      true
    );
  if (options.includesError)
    content = exportNewActionCreator(
      content,
      options.errorName,
      options.errorFileName,
      true
    );
  tree.write(targetFilePath, content);
};
const exportNewActionCreator = (
  content: string,
  actionClassName: string,
  actionFileName: string,
  isLoaderOrError?: boolean
): string => {
  content = exportActionCreator(
    content,
    actionClassName,
    actionFileName,
    isLoaderOrError
  );
  return content;
};

const exportActionCreator = (
  content: string,
  actionClassName: string,
  actionFileName: string,
  isLoaderOrError?: boolean
): string => {
  const replacementAnchorString = '-- EXPORT-ACTION-CREATORS --';
  const newContent = `\nexport {${
    isLoaderOrError === true ? 'set_' : 'new_'
  }${actionClassName}} from "./${actionFileName}";`;
  content = content.replace(
    replacementAnchorString,
    `${replacementAnchorString}${newContent}`
  );
  return content;
};

import { readFileIfExisting } from 'nx/src/project-graph/file-utils';
import { names, Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as path from 'path';
import { NormalizedSchema } from '../generator';
import { EnumDeclaration, Identifier } from 'typescript';

// const actionTypesModule = readFileIfExisting();
export const updateActionTypes = (tree: Tree, options: NormalizedSchema) => {
  const actionTypeModulePath = path.join(options.projectRoot, '/src/index.ts');
  const actionTypeModule = readFileIfExisting(actionTypeModulePath);
  const toInsert = `${options.actionName.toUpperCase()}="${options.actionName.toUpperCase()}", 
  `;
  if (actionTypeModule !== '') {
    // const newContents = tsquery.replace(
    //   actionTypeModule,
    //   'EnumDeclaration',
    //   (node) => {
    //     const enumNode = node as EnumDeclaration;
    //     if ((enumNode.name as Identifier).escapedText === 'ACTION_TYPES') {
    //       if (enumNode.members.length > 0) {
    //         const insertPosition = enumNode.members[0].getStart();
    //         // const outSertPos = enumNode.members[-1].getS
    //         const prevMembers = enumNode.getFullText();
    //         const prefix = prevMembers.substring(0, insertPosition);
    //         const suffix = prevMembers.substring(insertPosition);
    //         const newMembers = `${prefix}${toInsert}${suffix}`;
    //         return newMembers;
    //       }
    //     }
    //   }
    // );
    // const insertImportStatement = `import {${options.actionName}Interface} from "./${options.actionName}";\n`;
    // newContents = newContents.replace(
    //   'noopInterface;',
    //   `${options.actionName}Interface | noopInterface;`
    // );
    // newContents = `${insertImportStatement}${newContents}`;
    // if (newContents !== actionTypeModule) {
    //   tree.write(actionTypeModulePath, newContents);
    // }
  }
};

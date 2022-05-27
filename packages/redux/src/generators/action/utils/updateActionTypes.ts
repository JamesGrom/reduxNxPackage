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
    const newContents = tsquery.replace(
      actionTypeModule,
      'EnumDeclaration',
      (node) => {
        const vsNode = node as EnumDeclaration;
        if ((vsNode.name as Identifier).escapedText === 'ACTION_TYPES') {
          if (vsNode.members.length > 0) {
            const insertPosition = vsNode.members[0].getStart();
            const prevMembers = vsNode.getFullText();
            const prefix = prevMembers.substring(0, insertPosition);
            const suffix = prevMembers.substring(insertPosition);
            const newMembers = `${prefix}${toInsert}${suffix}`;
            return newMembers;
          }
        }
      }
    );
    if (newContents !== actionTypeModule) {
      tree.write(actionTypeModulePath, newContents);
    }
  }
};

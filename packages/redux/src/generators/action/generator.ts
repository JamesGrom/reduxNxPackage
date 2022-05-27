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
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: ReduxGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

enum WhichFiles {
  ACTION = 'ACTION',
}
function addFiles(
  tree: Tree,
  options: NormalizedSchema,
  whichFiles: WhichFiles
) {
  let fileDestination = options.projectRoot;
  switch (whichFiles) {
    case WhichFiles.ACTION: {
      fileDestination = options.projectRoot + '/src';
      break;
    }
    default:
      fileDestination = options.projectRoot;
      break;
  }
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    fileDestination,
    templateOptions
  );
}

export default async function (tree: Tree, options: ReduxGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions, WhichFiles.ACTION);
  await formatFiles(tree);
}

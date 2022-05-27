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

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (tree: Tree, options: ReduxGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  // addProjectConfiguration(tree, normalizedOptions.projectName, {
  //   root: normalizedOptions.projectRoot,
  //   projectType: 'library',
  //   sourceRoot: `${normalizedOptions.projectRoot}/src`,
  //   targets: {
  //     build: {
  //       executor: '@nrwl/node:webpack',
  //       outputs: ['{options.outputPath}'],
  //       options: {
  //         outputPath: `dist/apps/${normalizedOptions.projectName}`,
  //         main: `apps/${normalizedOptions.projectName}/src/main.ts`,
  //         tsConfig: `apps/${normalizedOptions.projectName}/tsconfig.app.json`,
  //         externalDependencies: 'none',
  //         outputFileName: 'index.js',
  //       },
  //     },
  //   },
  //   tags: normalizedOptions.parsedTags,
  // });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

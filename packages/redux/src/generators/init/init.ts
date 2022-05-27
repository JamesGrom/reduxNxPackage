import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
  Tree,
} from '@nrwl/devkit';
import { InitOptions } from './schema';
function normalizeArgs(schema: InitOptions) {
  return {
    ...schema,
  };
}
export async function initGenerator(host: Tree, options: InitOptions) {
  const args = normalizeArgs(options);
  console.log(`initGenerator(${host},${args})`);
  const installTask = addDependenciesToPackageJson(
    host,
    {
      '@nrwl/js': '^13.8.3',
      tslib: '^2.4.0',
    },
    {}
  );
  await formatFiles(host);
  return async () => {
    await installTask();
  };
}
export default initGenerator;
export const initSchematic = convertNxGenerator(initGenerator);

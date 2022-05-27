export interface ReduxGeneratorSchema {
  parentLibraryName: string;
  actionName: string;
  includesLoader: boolean;
  reducedStateName: string;
  initialValue: string;
}

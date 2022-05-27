export interface ActionGeneratorSchema {
  parentLibraryName: string;
  actionName: string;
  includesLoader: boolean;
  reducedStateName: string;
  initialValue: string;
}

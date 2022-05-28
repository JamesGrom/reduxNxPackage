export interface ActionGeneratorSchema {
  parentLibraryName: string;
  actionName: string;
  includesLoader: boolean;
  includesError: boolean;
  reducedStateName: string;
  initialValue: string;
}

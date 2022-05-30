export interface ActionGeneratorSchema {
  parentLibraryName: string;
  actionName: string;
  includesLoader: boolean;
  includesError: boolean;
  includesReducer: boolean;
  includesMiddlewareHandler: boolean;
  reducedStateName: string;
  payloadType: string;
  reducedStateName: string;
  reducedStateType: string;
  initialValue: string;
}

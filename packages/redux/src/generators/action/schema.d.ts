export interface ReduxGeneratorSchema {
  name: string;
  includesLoader: boolean;
  reducedStateName: string;
  initialValue: string;
  tags?: string;
  directory?: string;
}

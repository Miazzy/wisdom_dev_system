import { createTypes, VueTypesInterface, VueTypeValidableDef } from 'vue-types';
import { CSSProperties } from 'vue';

export type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>;
};

export const propTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  object: undefined,
  integer: undefined,
}) as PropTypes;

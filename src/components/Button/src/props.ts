const validColors = ['primary', 'error', 'warning', 'success', ''] as const;
type ButtonColorType = (typeof validColors)[number];

export const buttonProps = {
  color: {
    type: String as PropType<ButtonColorType>,
    validator: (v) => validColors.includes(v),
    default: '',
  },
  loading: { type: Boolean },
  disabled: { type: Boolean },
  permissionCode: { type: String },
  preIcon: { type: String },
  postIcon: { type: String },
  iconSize: { type: Number, default: 14 },
  onClick: { type: Function as PropType<(...args) => any>, default: null },
};

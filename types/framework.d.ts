export type InfoItem = {
  key: String,
  label: String,
  value: String,
  position: 'left' | 'center' | 'right'
};

export type BillTitleOptions = {
  title: String,
  bottomLine?: String,
  height?: Number,
  infoItems?: InfoItem[],
};
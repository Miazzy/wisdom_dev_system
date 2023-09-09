export type InfoItem = {
  key: String,
  label: String,
  value: String
};

export type BillTitleOptions = {
  title: String,
  infoItems?: InfoItem[],
  height: Number,
  bottomLine: String,
};
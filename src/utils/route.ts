export const parseRoutePath = (path: string): Record<string, string> => {
  const segments = path.split('/');
  const lastSegment = segments[segments.length - 1];
  const replacedEquals = lastSegment.replace(/__/g, '='); // 替换 __ 为 =
  const replacedAmpersand = replacedEquals.replace(/!!/g, '&'); // 替换 !! 为 &
  const replacedUnderscore = replacedAmpersand.replace(/_aa_/g, '&'); // 替换 _aa_ 为 &
  const queryParams: Record<string, string> = {}; // 解析为对象
  const pairs = replacedUnderscore.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    queryParams[key] = value;
  }
  return queryParams;
};


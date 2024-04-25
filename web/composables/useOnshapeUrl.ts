import { parseOnshapeUrl } from '@aklinker1/cutlist/onshape';

export default function (url: MaybeRefOrGetter<string>) {
  return computed(() => {
    const u = toValue(url);
    if (u == null) return undefined;
    return parseOnshapeUrl(u);
  });
}

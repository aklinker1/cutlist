export function useOnshapeUrl(url: MaybeRefOrGetter<string>) {
  return computed<OnshapeUrl | undefined>(() => {
    try {
      const path = new URL(toValue(url)).pathname;
      const matches =
        /^\/documents\/(?<did>.*?)\/.*?\/(?<wvmid>.*?)\/e\/(?<eid>.*?)$/.exec(
          path,
        );
      if (matches?.groups == null) return;

      return {
        did: matches.groups.did,
        wvmid: matches.groups.wvmid,
        eid: matches.groups.eid,
      };
    } catch {
      return;
    }
  });
}

export interface OnshapeUrl {
  did: string;
  wvmid: string;
  eid: string;
}

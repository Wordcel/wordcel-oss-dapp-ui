export const getTrimmedPublicKey = (
  public_key: string
) => {
  const TrimmedPublicKey = public_key.substring(0, 4)
    .concat('....')
    .concat(public_key.substring(public_key.length - 4));
  return TrimmedPublicKey;
};

export async function getIfWhitelisted(
  public_key: string
) {
  const request = await fetch(`/api/user/get/${public_key}`);
  return request.ok;
}
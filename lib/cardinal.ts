import axios from 'axios'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { breakName, findNamespaceId, tryGetName } from '@cardinal/namespaces'

export function apiBase(dev?: boolean): string {
  return `https://${dev ? 'dev-api' : 'api'}.cardinal.so`
}

export async function tryGetImageUrl(name: string, dev?: boolean): Promise<string | undefined> {
  try {
    const response = await axios.get(
      `${apiBase(
        dev
      )}/namespaces/twitter/proxy?url=https://api.twitter.com/2/users/by&usernames=${name}&user.fields=profile_image_url`
    )
    const json = response.data as {
      data: { profile_image_url: string }[]
    }
    return json?.data[0]?.profile_image_url.replace('_normal', '')
  } catch (e) {
    console.log(e)
    return undefined
  }
}

const TWITTER_NAMESPACE_NAME = 'twitter'

interface Identity {
  username: string | undefined
  displayImage: string | undefined
}

async function getIdentity(address: PublicKey): Promise<Identity | undefined> {
  try {
    const connection = new Connection(clusterApiUrl('mainnet-beta'))
    const [namespaceId] = await findNamespaceId(TWITTER_NAMESPACE_NAME)
    const displayNames = await tryGetName(connection, address, namespaceId)
    if (!displayNames) return
    const [_, handle] = displayNames ? breakName(displayNames[0]) : []
    if (!handle) return
    const imageUrl = await tryGetImageUrl(handle)
    if (!imageUrl) return
    return {
      username: handle,
      displayImage: imageUrl
    }
  } catch (e) {
    console.error(e)
  }
}

export { getIdentity }
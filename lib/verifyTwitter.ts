import * as nacl from 'tweetnacl';
import { PublicKey } from "@solana/web3.js";

export const messageToSign = (twitter: string) =>
  `I'm verifying my Twitter handle for Wordcel Club: ${twitter}`

export const getUserIdAndGuestToken = async (
  username: string
) => {
  try {
    const tokenRequest = await fetch('https://api.twitter.com/1.1/guest/activate.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
      }
    })
    const tokenData = await tokenRequest.json();
    const { guest_token } = tokenData;
    if (!guest_token) return;
    const response = await fetch(`https://twitter.com/i/api/graphql/7mjxD3-C6BxitPMVQ6w0-Q/UserByScreenName?variables=%7B%22screen_name%22%3A%22${username}%22%2C%22withSafetyModeUserFields%22%3Atrue%2C%22withSuperFollowsUserFields%22%3Atrue%7D`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "content-type": "application/json",
        "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        "x-guest-token": guest_token,
        "x-twitter-client-language": "en",
        "x-twitter-active-user": "yes",
        "x-csrf-token": "ffb380c8ea425d632bb6841d45875b55",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
      },
      method: "GET",
    })
    const json = await response.json();
    const id = json.data.user.result.rest_id;
    if (!id) return;
    return { id, guest_token };
  } catch (e) {
    console.error(e);
  }
};

export const verifyTwitterUsername = async (
  username: string,
  public_key: string,
) => {
  const basicData = await getUserIdAndGuestToken(username);
  if (!basicData || !basicData.id || !basicData.guest_token) return false;
  const request = await fetch(`https://twitter.com/i/api/graphql/AKPZtpVOPulWtyo5wSzrjA/UserTweetsAndReplies?variables=%7B%22userId%22%3A%22${basicData.id}%22%2C%22count%22%3A40%2C%22includePromotedContent%22%3Atrue%2C%22withCommunity%22%3Atrue%2C%22withSuperFollowsUserFields%22%3Atrue%2C%22withDownvotePerspective%22%3Afalse%2C%22withReactionsMetadata%22%3Afalse%2C%22withReactionsPerspective%22%3Afalse%2C%22withSuperFollowsTweetFields%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22dont_mention_me_view_api_enabled%22%3Atrue%2C%22interactive_text_enabled%22%3Atrue%2C%22responsive_web_uc_gql_enabled%22%3Afalse%2C%22vibe_tweet_context_enabled%22%3Afalse%2C%22responsive_web_edit_tweet_api_enabled%22%3Afalse%2C%22standardized_nudges_for_misinfo_nudges_enabled%22%3Afalse%7D`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
      "content-type": "application/json",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-csrf-token": "a21922f3907c91924bfc9de59cb45d3e",
      "x-guest-token": basicData.guest_token,
      "x-twitter-active-user": "yes",
      "x-twitter-client-language": "en",
      "cookie": "guest_id_marketing=v1%3A165488297347927646; guest_id_ads=v1%3A165488297347927646; personalization_id=\"v1_qE91js++8ns7cSNILb5/Gw==\"; guest_id=v1%3A165488297347927646; ct0=a21922f3907c91924bfc9de59cb45d3e; gt=1535316592145612800",
      "Referer": "https://twitter.com/wordcel_club",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  });
  const response = await request.json();
  const timeline = response?.data?.user?.result?.timeline_v2?.timeline?.instructions?.filter((f: any) => f.type === 'TimelineAddEntries')[0];
  if (!timeline) return false;
  const tweets = timeline.entries.filter((f: any) => f?.content?.itemContent?.itemType === 'TimelineTweet');
  if (!tweets || tweets.length === 0) return false;
  const text_content = tweets?.map((tweet: any) => tweet.content?.itemContent?.tweet_results?.result?.legacy?.full_text);
  if (!text_content || text_content.length === 0) return false;
  const base64_regex = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$');
  let signature_base_64 = '';
  for (const text of text_content) {
    const last_line = text.split('\n\n').pop();
    if (last_line.match(base64_regex)) {
      signature_base_64 = last_line;
      break;
    }
  }
  if (!signature_base_64) return false;
  const signature = Buffer.from(signature_base_64, 'base64');
  const message = new TextEncoder().encode(messageToSign(username));
  const public_key_bytes = new PublicKey(public_key).toBytes();
  const verified = nacl.sign.detached.verify(message, signature, public_key_bytes);
  return verified;
};

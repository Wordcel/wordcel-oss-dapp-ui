import prisma from '@/lib/prisma';
import { User, Connection, Article, Invite } from '@prisma/client';
import { getTrimmedPublicKey } from './getTrimmedPublicKey';

const getUserProfileURL = (user: User) => `*<https://wordcelclub.com/${user.username}|${user.name}>*`

const sendAlert = async (data: any) => {
  if (!process.env.SLACK_HOOK) {
    console.log('Warning: Slack Webhook URL not set');
    return
  }
  await fetch(process.env.SLACK_HOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

export const newUserAlert = async (user: User) => {
  sendAlert({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${user.name}* has just signed up on Wordcel 😍`
        }
      }
    ]
  })
};

export const newConnectionAlert = async (
  connection: Connection
) => {
  const connector = await prisma.user.findFirst({
    where: {
      public_key: connection.connector
    }
  });
  const profileOwner = await prisma.user.findFirst({
    where: {
      public_key: connection.profile_owner
    }
  });
  if (!connector || !profileOwner) return;
  sendAlert({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${getUserProfileURL(connector)} has just connected to ${getUserProfileURL(profileOwner)} 🤝`
        }
      }
    ]
  });
};

export const newPostAlert = async (
  post: Article
) => {
  const poster = await prisma.user.findFirst({
    where: {
      id: post.user_id
    }
  });
  if (!poster) return;
  sendAlert({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${getUserProfileURL(poster)} has just published a new post!`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<https://wordcelclub.com/${poster.username}/${post.slug}|${post.title}>`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: post.description
        }
      }
    ]
  });
}

export const newInviteAlert = async (
  invite: Invite
) => {
  const inviter = await prisma.user.findFirst({
    where: {
      id: invite.user_id
    }
  });
  if (!inviter) return;
  sendAlert({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${getUserProfileURL(inviter)} has just invited *<https://explorer.solana.com/address/${invite.receiver}|${
            invite.receiver_name ? invite.receiver_name : getTrimmedPublicKey(invite.receiver)
          }>* to Wordcel!`
        }
      },
    ]
  });
};

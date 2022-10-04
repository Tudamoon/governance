import { requiredEnv } from 'decentraland-gatsby/dist/utils/env'

import { DiscoursePostInTopic, DiscourseTopic } from '../../clients/Discourse'
import { env } from '../../modules/env'
import { ProposalComment, ProposalCommentsInDiscourse } from '../Proposal/types'

export const DISCOURSE_USER = env('GATSBY_DISCOURSE_USER') || ''
export const BASE_AVATAR_URL = requiredEnv('DISCOURSE_BASE_AVATAR_URL')
const DEFAULT_AVATAR_SIZE = '45'

function getDefaultAvatarSizeUrl(avatar_url: string) {
  return avatar_url.replace('{size}', DEFAULT_AVATAR_SIZE)
}

function setAvatarUrl(post: DiscoursePostInTopic) {
  const defaultSizeUrl = getDefaultAvatarSizeUrl(post.avatar_template)
  return defaultSizeUrl.includes('letter') ? defaultSizeUrl : BASE_AVATAR_URL + defaultSizeUrl
}

export function filterComments(comments: DiscourseTopic): ProposalCommentsInDiscourse {
  const posts = comments.post_stream.posts
  const userPosts = posts.filter(
    (post) => ![DISCOURSE_USER.toLowerCase(), 'system'].includes(post.username.toLowerCase())
  )

  const proposalComments: ProposalComment[] = userPosts.map((post) => {
    return {
      username: post.username,
      avatar_url: setAvatarUrl(post),
      created_at: post.created_at,
      cooked: post.cooked,
    }
  })

  return {
    totalComments: userPosts.length,
    comments: proposalComments,
  }
}

import useAsyncMemo from 'decentraland-gatsby/dist/hooks/useAsyncMemo'

import { GetProposalsFilter, Governance } from '../clients/Governance'
import { MAX_PROPOSAL_LIMIT } from '../entities/Proposal/utils'

export type UseProposalsFilter = Omit<GetProposalsFilter, 'subscribed' | 'limit' | 'offset'> & {
  subscribed: string | boolean
  page: number
  itemsPerPage: number
  load: boolean
}

export default function useProposals(filter: Partial<UseProposalsFilter> = {}) {
  const [proposals, state] = useAsyncMemo(async () => {
    if (filter.load === false) {
      return {
        ok: true,
        total: 0,
        data: [],
      }
    }
    const limit = filter.itemsPerPage ?? MAX_PROPOSAL_LIMIT
    const offset = ((filter.page ?? 1) - 1) * limit
    const params: Partial<GetProposalsFilter> = { limit, offset }
    if (filter.status) {
      params.status = filter.status
    }
    if (filter.type) {
      params.type = filter.type
    }
    if (filter.user) {
      params.user = filter.user
    }
    if (filter.subscribed) {
      params.subscribed = !!filter.subscribed
    }
    if (filter.search) {
      params.search = filter.search
    }
    if (filter.timeFrame) {
      params.timeFrame = filter.timeFrame
    }
    if (filter.timeFrameKey) {
      params.timeFrameKey = filter.timeFrameKey
    }
    if (filter.order) {
      params.order = filter.order
    }
    if (filter.coauthor) {
      params.coauthor = filter.coauthor
    }
    if (filter.snapshotIds) {
      params.snapshotIds = filter.snapshotIds
    }

    return Governance.get().getProposals({ ...params, limit, offset })
  }, [
    filter.status,
    filter.type,
    filter.user,
    filter.subscribed,
    filter.search,
    filter.timeFrame,
    filter.timeFrameKey,
    filter.order,
    filter.page,
    filter.itemsPerPage,
    filter.load,
    filter.coauthor,
    filter.snapshotIds,
  ])

  return {
    proposals,
    isLoadingProposals: state.loading,
  }
}

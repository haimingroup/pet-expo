import {apiPost} from '@/utils/request.js'

//获取投票主题详情
export function getPollInfo(data) {
    return apiPost({
        url: '/v3/poll/getPollInfo',
        data: data
    })
}
//获取投票作品列表
export function getWorkList(data) {
    return apiPost({
        url: '/v3/poll/getWorkList',
        data: data
    })
}
//获取作品详情
export function getWorkInfo(data) {
    return apiPost({
        url: '/v3/poll/getWorkInfo',
        data: data
    })
}
//主题投票作品总排行
export function getWorkRankingList(data) {
    return apiPost({
        url: '/v3/poll/getWorkRankingList',
        data: data
    })
}
//用户投票
export function userVotesWork(data) {
    return apiPost({
        url: '/v3/poll/userVotesWork',
        data: data
    })
}
//获取投票列表
export function getPollList(data) {
    return apiPost({
        url: '/v3/poll/getPollList',
        data: data
    })
}

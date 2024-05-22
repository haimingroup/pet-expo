import {
	apiGet,
	apiPost
} from '@/utils/request.js'

// 参展店铺列表 
export function getStoreList(data) {
	return apiPost({
		url: '/v2/store/getStoreList',
		data: data
	})
}

// 店铺详情
export function getStoreInfo(data) {
	return apiPost({
		url: '/v2/store/getStoreInfo',
		data: data
	})
}

// 所有参展店铺展品列表
export function getGoodList(data) {
	return apiPost({
		url: '/v2/goods/getGoodList',
		data: data
	})
}

// 展品详情
export function getGoodInfo(data) {
	return apiPost({
		url: '/v2/goods/getGoodInfo',
		data: data
	})
}

// 当前店铺的展品列表
export function getStoreGoods(data) {
	return apiPost({
		url: '/v2/store/getStoreGoods',
		data: data
	})
}
// 店铺收藏&取消收藏
export function storeCollection(data) {
	return apiPost({
		url: '/v2/store/collection',
		data: data
	})
}
// 展品收藏&取消收藏
export function goodsCollection(data) {
	return apiPost({
		url: '/v2/goods/collection',
		data: data
	})
}

// 收藏的店铺列表
export function getCollectionStore(data) {
	return apiPost({
		url: '/v2/user/getCollectionStore',
		data: data
	})
}
// 收藏的展品列表
export function getCollectionGoods(data) {
	return apiPost({
		url: '/v2/user/getCollectionGoods',
		data: data
	})
}
// 个人中心的数据
export function getInfo(data) {
	return apiPost({
		url: '/v2/user/getInfo',
		data: data
	})
}
// 店铺资质信息
export function getCompanyInfo(data) {
	return apiPost({
		url: '/v2/user/store/getCompanyInfo',
		data: data
	})
}
// 我的店铺信息
export function getMyStore(data) {
	return apiPost({
		url: '/v2/user/store/getMyStore',
		data: data
	})
}
// 修改店铺信息
export function saveMyStore(data) {
	return apiPost({
		url: '/v2/user/store/saveMyStore',
		data: data
	})
}
// 我的店铺联系人列表
export function getMyStoreUser(data) {
	return apiPost({
		url: '/v2/user/store/getMyStoreUser',
		data: data
	})
}
// 联系人详情
export function getMyStoreUserInfo(data) {
	return apiPost({
		url: '/v2/user/store/getMyStoreUserInfo',
		data: data
	})
}
// 添加联系人信息
export function addMyStoreUser(data) {
	return apiPost({
		url: '/v2/user/store/addMyStoreUser',
		data: data
	})
}
// 修改联系人信息
export function editMyStoreUser(data) {
	return apiPost({
		url: '/v2/user/store/editMyStoreUser',
		data: data
	})
}
// 我的展品列表
export function getMyGoodList(data) {
	return apiPost({
		url: '/v2/user/goods/getMyGoodList',
		data: data
	})
}
// 添加展品
export function addMyGood(data) {
	return apiPost({
		url: '/v2/user/goods/addMyGood',
		data: data
	})
}
// 我的展品详情
export function getMyGoodInfo(data) {
	return apiPost({
		url: '/v2/user/goods/getMyGoodInfo',
		data: data
	})
}
// 修改展品
export function editMyGood(data) {
	return apiPost({
		url: '/v2/user/goods/editMyGood',
		data: data
	})
}
// 操作展品
export function opMyGood(data) {
	return apiPost({
		url: '/v2/user/goods/opMyGood',
		data: data
	})
}
// 我的团队
export function getMyTeamInfoE(data) {
	return apiPost({
		url: '/v2/team/getMyTeamInfo',
		data: data
	})
}

// 开团
export function createTeamE(data) {
	return apiPost({
		url: '/v2/team/createTeam',
		data: data
	})
}
// 团队排行
export function getTopTeamE(data) {
	return apiPost({
		url: '/v2/team/getTopTeam',
		data: data
	})
}

// 团队详情
export function getTeamInfoE(data) {
	return apiPost({
		url: '/v2/team/getTeamInfo',
		data: data
	})
}

// 店铺分享数据
export function getStorePost(data) {
	return apiPost({
		url: '/v2/store/getStorePost',
		data: data
	})
}

// 上传
export function fileUp(data) {
	return apiPost({
		url: '/v1/system/fileUp',
		data: data
	})
}
// 获取展品标签集
export function getGoodTags(data) {
	return apiPost({
		url: '/v1/system/getGoodTags',
		data: data
	})
}
// 获取店铺标签集
export function getStoreTags(data) {
	return apiPost({
		url: '/v1/system/getStoreTags',
		data: data
	})
}

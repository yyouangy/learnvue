import { myFetch } from '../../config/fetch.js'
const baseUrl = 'http://192.168.8.64:9099'

// 列表
export const getSubsOf500KV = (level) => myFetch(baseUrl + '/gis/getSubList/' + level + '/', {}, 'GET')
export const getSubsOf220KV = (level) => myFetch(baseUrl + '/gis/getSubList/' + level, {}, 'GET')
export const getSubsOf110KV = (level) => myFetch(baseUrl + '/gis/getSubList/' + level, {}, 'GET')
export const getDisPoints = (id) => myFetch(baseUrl + '/gis/getDisPoints/' + id, {}, 'GET')
    // 全量数据
export const getAllDisPoints = () => myFetch(baseUrl + '/gis/getAllDisPoints', {}, 'GET')
    //获取550to220，220to110连线
export const getAclineList = (level) => myFetch(baseUrl + '/gis/getAclineList/' + level, {}, 'GET')
    //获取220KV,110KV变电站和10KV配电室的连线
export const getDaclineList = (level) => myFetch(baseUrl + '/gis/getDaclineListByLevel/' + level, {}, 'GET')

export const getBoundsData = (bounds) => myFetch(baseUrl + '/gis/getBoundsData', bounds, 'POST')

export const getSubEquById = (id) => myFetch(baseUrl + '/index/getSubEquById/'+id, {}, 'get')

// 获取下层节点
export const getSubNodeById = (id) => myFetch(baseUrl + '/gis/getSubNodeById/'+id, {}, 'get')



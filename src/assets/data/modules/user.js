const state = {
    access_token: sessionStorage.getItem(`access_token`) || ``,
    userInfo: JSON.parse(sessionStorage.getItem(`userInfo`)) || {},
    roleInfoList:JSON.parse(sessionStorage.getItem(`roleInfoList`))||[],
    roleArr:JSON.parse(sessionStorage.getItem(`roleArr`))||[],
};
const getters = {

};
const mutations = {
    setToken(state, token) {
        sessionStorage.setItem(`access_token`, token)
        state.access_token = token
    },
    setUserInfo(state, userInfo) {
        sessionStorage.setItem(`userInfo`, userInfo.userInfo)
        console.log(userInfo)
        state.userInfo = JSON.parse(userInfo.userInfo)
    },
    clearToken(state) {
        sessionStorage.setItem(`access_token`, ``);
        sessionStorage.setItem(`userInfo`, ``);
        sessionStorage.setItem(`roleArr`, ``);
        sessionStorage.setItem(`roleInfoList`,``);

        state.access_token = ``;
        state.userInfo = {}
        state.roleArr = []
        state.roleInfoList = []
    },
    //保存菜单
    setRoleInfoList(state, roleInfoList) {
        sessionStorage.setItem(`roleInfoList`, JSON.stringify(roleInfoList))
        state.roleInfoList = roleInfoList
    },
    setRole(state,roleArr){
        sessionStorage.setItem(`roleArr`, JSON.stringify(roleArr))
        state.roleArr = roleArr
    },
};
const actions = {
    updateUserInfo(context, value) {
        context.commit('setUserInfo', value)
    },
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
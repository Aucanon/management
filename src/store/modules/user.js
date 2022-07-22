import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

const getDefaultState = () => {
    return {
        //获取token
        token: getToken(),
        //存储用户名
        name: '',
        //存储用户头像
        avatar: '',
        //服务器返回的菜单信息【根据不同的角色：返回的标记信息，数组里面的元素是字符串】
        routes: [],
        //角色信息
        roles: [],
        //按钮权限的信息
        buttons: [],
        //对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的理由】
        resultAsyncRoutes: [],
        //用户最终需要展示全部路由
        resultAllRoutes: []
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    // SET_NAME: (state, name) => {
    //     state.name = name
    // },
    // SET_AVATAR: (state, avatar) => {
    //     state.avatar = avatar
    // }
    SET_USERINFO: (state, userInfo) => {
        //用户名
        state.name = userInfo.name;
        //用户头像
        state.avatar = userInfo.avatar;
        //菜单权限标记
        state.routes = userInfo.routes;
        //按钮权限标记
        state.buttons = userInfo.buttons;
        //角色
        state.roles = userInfo.roles;
    },
    //最终计算异步路由
    SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
        //vuex保存当前用户的异步路由，注意，一个用户需要展示完成路由：常量、异步、任意路由
        state.resultAsyncRoutes = asyncRoutes;
        //计算出当前用户需要展示所有路由
        state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
        //给路由器添加新的路由
        router.addRoutes(state.resultAllRoutes)
    }
}

const actions = {
    // user login
    async login({ commit }, userInfo) {
        const { username, password } = userInfo
        let result = await login({ username: username.trim(), password: password })
        if (result.code == 20000) {
            commit('SET_TOKEN', result.data.token)
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
        // return new Promise((resolve, reject) => {
        //   login({ username: username.trim(), password: password }).then(response => {
        //     const { data } = response
        //     commit('SET_TOKEN', data.token)
        //     setToken(data.token)
        //     resolve()
        //   }).catch(error => {
        //     reject(error)
        //   })
        // })
    },

    // get user info
    // async getInfo({ commit, state }) {
    //     //     let result = await getInfo(state.token)
    //     //     if (result.code == 20000) {
    //     //         // commit('SET_NAME', result.data.name)
    //     //         // commit('SET_AVATAR', result.data.avatar)
    //     //         commit('SET_USERINFO', result.data)
    //     //         return 'ok'
    //     //     } else {
    //     //         return Promise.reject(new Error('faile'))
    //     //     }

    // //     return new Promise((resolve, reject) => {
    // //         getInfo(state.token).then(response => {
    // //             const { data } = response

    // //             if (!data) {
    // //                 return reject('Verification failed, please Login again.')
    // //             }

    // //             const { name, avatar } = data
    // //             // console.log(response);
    // //             commit('SET_USERINFO', data)
    // //                 // commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
    // //             commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
    // //             resolve(data)
    // //         }).catch(error => {
    // //             reject(error)
    // //         })
    // //     })
    // // },
    async getInfo({ commit, state }) {
        let result = await getInfo(state.token)
        if (result.code == 20000) {
            commit('SET_USERINFO', result.data)
            commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, result.data.routes))
            console.log(asyncRoutes, 111);
            console.log(result.data.routes);
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },

    // user logout
    async logout({ commit, state }) {
        let result = await logout(state.token)
        if (result.code == 20000) {
            removeToken()
            resetRouter()
            commit('RESET_STATE')
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
        // return new Promise((resolve, reject) => {
        //     logout(state.token).then(() => {
        //         removeToken() // must remove  token  first
        //         resetRouter()
        //         commit('RESET_STATE')
        //         resolve()
        //     }).catch(error => {
        //         reject(error)
        //     })
        // })
    },

    // remove token
    async resetToken({ commit }) {
        let result = await removeToken()
        if (result.code == 20000) {
            commit('RESET_STATE')
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
        // return new Promise(resolve => {
        //     removeToken() // must remove  token  first
        //     commit('RESET_STATE')
        //     resolve()
        // })
    }
}

const computedAsyncRoutes = (asyncRoutes, routes) => {
    //过滤出当前用户【超级管理|普通员工】需要展示的异步路由
    return asyncRoutes.filter(item => {
        //数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1 
        if (routes.indexOf(item.name) != -1) {
            //递归:别忘记还有2、3、4、5、6级路由
            if (item.children && item.children.length) {
                item.children = computedAsyncRoutes(item.children, routes);
            }
            return true;
        }
    })
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
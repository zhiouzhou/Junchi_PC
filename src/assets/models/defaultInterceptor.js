import router from '../../router'
const responseInterceptor = {
    response: (response) => {
        // tryHideFullScreenLoading();
        console.log(response)
        if (response.data.code == 401) {
            router.replace({
                path: 'login'// 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
        return response

    },
    error: (error) => {
        console.log('响应出错')
        console.log('error', error.response)
        console.log(router.currentRoute)
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    router.replace({
                        name: 'login',// 将跳转的路由path作为参数，登录成功后跳转到该路由
                        query:{redirect:router.currentRoute.fullPath}
                    })
            }
        }
        return Promise.reject(error.response)
    },
}
export default { responseInterceptor }
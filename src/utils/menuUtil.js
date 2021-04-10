import { getRequest } from './apiUtil'

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return
    }
    getRequest('/system/authority/getMenus').then(result => {
        if (result && result.success) {
            let routes = formatRoutes(result.data)
            routes.push({
                id: 0,
                path: '/about',
                name: 'About',
                component: () => import('../views/About.vue')
            })
            let homeRoute = {
                id: 1,
                path: '/home',
                name: 'Home',
                component: () => import('../views/Home.vue'),
                children: routes
            }
            router.addRoute(homeRoute)
            store.commit('initMenu', routes)
        }
    })
}

export const formatRoutes = menus => {
    let routes = []
    menus.forEach(menu => {
        let children = menu.children
        if (children && children instanceof Array) {
            children = formatRoutes(children)
        }
        let route = {
            id: menu.id,
            path: menu.path,
            name: menu.name,
            component(resolve) {
                if (menu.component) {
                    require(['../views' + menu.url + '/' + menu.component + '.vue'], resolve)
                } else {
                    require(['../views/About.vue'], resolve)
                }
            },
            iconCls: menu.icon,
            children: children
        }
        routes.push(route)
    })
    return routes
}
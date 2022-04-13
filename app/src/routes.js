export default [{
        name: 'Feed',
        path: '/',
        component: require('@/components/PageFeed').default,
    },
    {
        name: 'Find Topics',
        path: '/topics/:topic?',
        component: require('@/components/PageTag').default,
    },
    {
        name: 'Users',
        path: '/users/:author?',
        component: require('@/components/PageUsers').default,
    },
    {
        name: 'Profile',
        path: '/profile',
        component: require('@/components/PageProfile').default,
    },
    {
        name: 'Post',
        path: '/post/:post',
        component: require('@/components/PagePost').default,
    },
    {
        name: 'NotFound',
        path: '/:pathMatch(.*)*',
        component: require('@/components/PageNotFound').default,
    },
]
import dashboard from 'routes/dashboard'
import article from 'routes/article'
import settings from 'routes/settings'
import add from 'routes/add'

export const routes = [
  { path: '/', component: dashboard, name: 'dashboard', meta: { auth: true } },
  { path: '/article/:articleId', component: article, name: 'article', meta: { auth: true } },
  { path: '/settings', component: settings, name: 'settings', meta: { auth: true } },
  { path: '/add', component: add, name: 'add' }
]

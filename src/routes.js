import Dashboard from 'routes/dashboard'
import Article from 'routes/article'

export const routes = [
  { path: '/', component: Dashboard, name: 'dashboard', meta: { auth: true } },
  { path: '/article', component: Article, name: 'article', meta: { auth: true } }
]

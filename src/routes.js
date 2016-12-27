import Dashboard from 'routes/dashboard'
import Article from 'routes/article'
import Add from 'routes/add'

export const routes = [
  { path: '/', component: Dashboard, name: 'dashboard', meta: { auth: true } },
  { path: '/article/:articleId', component: Article, name: 'article', meta: { auth: true } },
  { path: '/add', component: Add, name: 'add' }
]

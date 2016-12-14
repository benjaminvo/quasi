import Texts from 'routes/texts'
import Article from 'routes/article'

export const routes = [
  { path: '/', component: Texts, name: 'texts', meta: { auth: true } },
  { path: '/article', component: Article, name: 'article', meta: { auth: true } }
]

import Texts from 'routes/texts'
import Read from 'routes/read'

export const routes = [
  { path: '/', component: Texts, name: 'texts', meta: { auth: true } },
  { path: '/read', component: Read, name: 'read', meta: { auth: true } }
]

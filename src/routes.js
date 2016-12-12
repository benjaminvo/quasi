import Texts from 'routes/texts'
import Read from 'routes/read'

export const routes = [
  { path: '/', component: Texts, name: 'texts' },
  { path: '/read/:textId', component: Read, name: 'read' }
]

export const showNoFunctionMessageThenHide = {
  methods: {
    showNoFunctionMessageThenHide(e) {
      const targetClassesInitial = e.target.className
      const targetClassesNew = e.target.className += ' showNoFunctionMessage'
      e.target.className = targetClassesNew
      setTimeout( () => { e.target.className = targetClassesInitial }, 1000)
    }
  }
}

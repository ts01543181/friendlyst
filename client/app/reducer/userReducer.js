module.exports = (state={
  user: {}
}, action) => {
  switch(action.type) {
    case 'NEW_USER':
      state = Object.assign({}, state, {
        user: {}
      })
 
      return state
    default:
        return state
  }
}
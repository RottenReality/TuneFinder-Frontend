const userReducer = (state = null, action) => {
  switch(action.type) {
    case 'SET_USER':
      return action.data
    default:
      return state
  }
}

export const setUser = (user) => {
  return async dispatch => {
    const data = user
    dispatch({
      type: 'SET_USER',
      data
    })
  }
}


export default userReducer
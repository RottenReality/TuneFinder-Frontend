const tokenReducer = (state = null, action) => {
  switch(action.type) {
    case 'SET_TOKEN':
      return action.data
    case 'DEL_TOKEN': 
      return null
    default:
      return state
  }
}

export const userLogin = token => {
  return async dispatch => {
    const data = token
    dispatch({
      type: 'SET_TOKEN',
      data
    })
  }
}

export const userLogout = () => {
  return async dispatch => {
    dispatch({
      type: 'DEL_TOKEN'
    })
  }
}

export default tokenReducer
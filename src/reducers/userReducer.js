const userReducer = (state = null, action) => {
  if (action.type === "SET_USER") {
    return action.data;
  }
  return state;
};


export const setUser = (user) => {
  return async (dispatch) => {
    const data = user;
    dispatch({
      type: "SET_USER",
      data,
    });
  };
};

export default userReducer;

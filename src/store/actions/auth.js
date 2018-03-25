import axios from 'axios'
import * as actionTypes from './actionTypes'

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const authSuccess = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken,
    userId
  }
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    }, 3600 * 1000)
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('expirationDate')
  localStorage.removeItem('userId')
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart())
    const authData = {
      email,
      password,
      returnSecureToken: true
    }

    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDp2BUWMlwZi8Ve2DepR9pjkt9wwR58T80'

    if (!isSignup) {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDp2BUWMlwZi8Ve2DepR9pjkt9wwR58T80'
    }

    axios.post(url, authData)
      .then(res => {
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
        localStorage.setItem('token', res.data.idToken)
        localStorage.setItem('expirationDate', expirationDate)
        localStorage.setItem('userId', res.data.localId)
        dispatch(authSuccess(res.data.idToken, res.data.localId))
        dispatch(checkAuthTimeout(res.data.expiresIn))
      })
      .catch(e => {
        dispatch(authFail(e.response.data.error))
      })
  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path
  }
}

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(logout())
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'))
      if (expirationDate > new Date()) {
        const userId = localStorage.getItem('userId')
        dispatch(authSuccess(token, userId))
        dispatch(checkAuthTimeout())
      } else {
        dispatch(logout())
      }
    }
  }
}

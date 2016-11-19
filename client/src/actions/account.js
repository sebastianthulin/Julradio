const request = require('superagent')
const {errorNotify} = require('./notifications')

const handleErr = dispatch => err => {
  dispatch(errorNotify(err))
  return err
}

export const receiveAccount = account => {
  if (account.birth) {
    account.birth = new Date(account.birth)
  }
  return {
    type: 'RECEIVE_ACCOUNT',
    account
  }
}

export const blockUser = userId => dispatch => {
  return request.post('/api/user/block', {userId}).then(() => null).catch(handleErr(dispatch))
}

export const unblockUser = userId => dispatch => {
  return request.delete('/api/user/block/' + userId).then(() => null).catch(handleErr(dispatch))
}

export const updateAccountSettings = opts => dispatch => {
  return request.put('/api/user/settings', opts).then(
    res => {
      dispatch(receiveAccount(res.body))
    },
    handleErr(dispatch)
  )
}

export const updateAccountSettings2 =  opts => dispatch => {
  return request.put('/api/user/settings2', opts).then(
    res => {
      dispatch(receiveAccount(res.body))
    },
    handleErr(dispatch)
  )
}

export const setAvatar = file => dispatch => {
  const formData = new FormData
  formData.append('avatar', file)
  return request.post('/api/user/profilepicture').send(formData).then(
    res => {
      dispatch(receiveAccount(res.body))
    },
    handleErr(dispatch)
  )
}

export const removeAvatar = () => dispatch => {
  return request.delete('/api/user/profilepicture').then(
    res => {
      dispatch(receiveAccount(res.body))
    },
    handleErr(dispatch)
  )
}

export const forgotPassword = email => dispatch => {
  return request.post('/api/forgot', {email}).then(() => null).catch(handleErr(dispatch))
}

export const newPassword = (id, password) => dispatch => {
  request.post('/api/forgot/' + id, {password}).then(() => {
    window.location = '/'
  }).catch(handleErr(dispatch))
}

export const logIn = creds => dispatch => {
  request.post('/api/user/login', creds).then(() => {
    location.reload()
  }).catch(handleErr(dispatch))
}

export const signUp = form => dispatch => {
  return request.post('/api/user/signup', form).then(() => null).catch(handleErr(dispatch))
}

export const logOut = () => () => {
  window.location = '/api/user/logout'
}

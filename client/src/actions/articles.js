const request = require('superagent')
const {List} = require('immutable')
const marked = require('marked')
const {browserHistory} = require('react-router')
const {createNotification, errorNotify} = require('./notifications')

const transform = article => {
  if (article.content) {
    article.marked = marked(article.content)
  }
  article.date = new Date(article.date)
  return article
}

export const fetchArticles = () => dispatch => {
  dispatch({type: 'FETCH_ARTICLES_REQUEST'})
  request.get('/api/articles').then(res => {
    dispatch({
      type: 'FETCH_ARTICLES_SUCCESS',
      articles: List(res.body).map(transform)
    })
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const fetchAllArticles = () => dispatch => {
  dispatch({type: 'FETCH_ALL_ARTICLES_REQUEST'})
  request.get('/api/articles/all').then(res => {
    dispatch({
      type: 'FETCH_ALL_ARTICLES_SUCCESS',
      articles: List(res.body).map(transform)
    })
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const fetchArticle = id => dispatch => {
  dispatch({
    type: 'FETCH_ARTICLE_REQUEST',
    id
  })
  request.get('/api/articles/' + id).then(res => {
    dispatch({
      type: 'FETCH_ARTICLE_SUCCESS',
      id,
      article: transform(res.body)
    })
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const editArticle = id => dispatch => {
  id && dispatch(fetchArticle(id))
  dispatch({
    type: 'EDIT_ARTICLE',
    id,
    user: require('immutable').fromJS(require('../services/User').get())
  })
}

export const cancelEdit = () => ({
  type: 'CANCEL_EDIT'
})

export const updateArticleLocally = ({title, content, userless}) => (dispatch, getState) => {
  const user = userless ? null : require('immutable').fromJS(require('../services/User').get())
  dispatch({
    type: 'UPDATE_ARTICLE_LOCALLY',
    title,
    content,
    marked: marked(content),
    user
  })
}

export const createArticle = () => (dispatch, getState) => {
  const article = getState().articles.get('editing')
  request.post('/api/articles', {
    title: article.get('title'),
    content: article.get('content'),
    userless: !article.get('user')
  }).then(res => {
    browserHistory.push(`/admin/articles/${res.body._id}`)
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const updateArticle = () => (dispatch, getState) => {
  const article = getState().articles.get('editing')
  request.put(`/api/articles/${article.get('_id')}`, {
    title: article.get('title'),
    content: article.get('content')
  }).then(() => {
    dispatch(createNotification({name: 'article'}))
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const deleteArticle = () => (dispatch, getState) => {
  const id = getState().articles.getIn(['editing', '_id'])
  request.delete('/api/articles/' + id).then(() => {
    browserHistory.replace('/admin/articles')
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const togglePin = id => (dispatch, getState) => {
  const pinned = !getState().articles.getIn(['byId', id, 'pinned'])
  request.put('/api/articles/pin', {id, pinned}).then(() => {
    dispatch({
      type: 'TOGGLE_PIN_SUCCESS',
      id,
      pinned
    })
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

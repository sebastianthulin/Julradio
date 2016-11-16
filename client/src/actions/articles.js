const {List} = require('immutable')
const marked = require('marked')
const {browserHistory} = require('react-router')
const API = require('../services/API')
const {createNotification} = require('./notifications')

const transform = article => {
  if (article.content) {
    article.marked = marked(article.content)
  }
  article.date = new Date(article.date)
  return article
}

export const fetchArticles = () => dispatch => {
  dispatch({type: 'FETCH_ARTICLES_REQUEST'})
  API.get('/articles', articles => {
    dispatch({
      type: 'FETCH_ARTICLES_SUCCESS',
      articles: List(articles).map(transform)
    })
  })
}

export const fetchAllArticles = () => dispatch => {
  dispatch({type: 'FETCH_ALL_ARTICLES_REQUEST'})
  API.get('/articles/all', articles => {
    dispatch({
      type: 'FETCH_ALL_ARTICLES_SUCCESS',
      articles: List(articles).map(transform)
    })
  })
}

export const fetchArticle = id => dispatch => {
  dispatch({
    type: 'FETCH_ARTICLE_REQUEST',
    id
  })
  API.get('/articles/' + id, article => {
    dispatch({
      type: 'FETCH_ARTICLE_SUCCESS',
      id,
      article: transform(article)
    })
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
  API.post('/articles', {
    title: article.get('title'),
    content: article.get('content'),
    userless: !article.get('user')
  }, article => {
    browserHistory.push(`/admin/articles/${article._id}`)
  })
}

export const updateArticle = () => (dispatch, getState) => {
  const article = getState().articles.get('editing')
  API.put(`/articles/${article.get('_id')}`, {
    title: article.get('title'),
    content: article.get('content')
  }, () => {
    dispatch(createNotification({name: 'article'}))
  })
}

export const deleteArticle = () => (dispatch, getState) => {
  const id = getState().articles.getIn(['editing', '_id'])
  API.delete('/articles/' + id, () => {
    browserHistory.replace('/admin/articles')
  })
}

export const togglePin = id => (dispatch, getState) => {
  const pinned = !getState().articles.getIn(['byId', id, 'pinned'])
  API.put('/articles/pin', {id, pinned}, () => {
    dispatch({
      type: 'TOGGLE_PIN_SUCCESS',
      id,
      pinned
    })
  })
}

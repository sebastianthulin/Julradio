const { List } = require('immutable')
const marked = require('marked')
const API = require('../services/API')
const history = require('../services/history')
const NotificationStore = require('../stores/NotificationStore')

function transform(article) {
  if (article.content) {
    article.marked = marked(article.content)
  }
  article.date = new Date(article.date)
  return article
}

export const fetchArticles = () => {
  return dispatch => {
    dispatch({type: 'FETCH_ARTICLES_REQUEST'})
    API.get('/articles', articles => {
      dispatch({
        type: 'FETCH_ARTICLES_SUCCESS',
        articles: List(articles).map(transform)
      })
    })
  }
}

export const fetchAllArticles = () => {
  return dispatch => {
    dispatch({type: 'FETCH_ALL_ARTICLES_REQUEST'})
    API.get('/articles/all', articles => {
      dispatch({
        type: 'FETCH_ALL_ARTICLES_SUCCESS',
        articles: List(articles).map(transform)
      })
    })
  }
}

export const fetchArticle = id => {
  return dispatch => {
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
}

export const editArticle = id => {
  return dispatch => {
    id && dispatch(fetchArticle(id))
    dispatch({
      type: 'EDIT_ARTICLE',
      id,
      user: require('immutable').fromJS(require('../services/User').get())
    })
  }
}

export const cancelEdit = () => ({
  type: 'CANCEL_EDIT'
})

export const updateArticleLocally = ({ title, content, userless }) => {
  return (dispatch, getState) => {
    const user = userless ? null : require('immutable').fromJS(require('../services/User').get())
    dispatch({
      type: 'UPDATE_ARTICLE_LOCALLY',
      title,
      content,
      marked: marked(content),
      user
    })
  }
}

export const createArticle = () => {
  return (dispatch, getState) => {
    const article = getState().articles.get('editing')
    API.post('/articles', {
      title: article.get('title'),
      content: article.get('content'),
      userless: !article.get('user')
    }, article => {
      history.push(`/admin/articles/${article._id}`)
    })
  }
}

export const updateArticle = () => {
  return (dispatch, getState) => {
    const article = getState().articles.get('editing')
    API.put(`/articles/${article.get('_id')}`, {
      title: article.get('title'),
      content: article.get('content')
    }, () => {
      NotificationStore.insert({type: 'article'})
    })
  }
}

export const deleteArticle = () => {
  return (dispatch, getState) => {
    const id = getState().articles.getIn(['editing', '_id'])
    API.delete('/articles/' + id, () => {
      history.replace('/admin/articles')
    })
  }
}

export const togglePin = id => {
  return (dispatch, getState) => {
    const pinned = !getState().articles.getIn(['byId', id, 'pinned'])
    API.put('/articles/pin', { id, pinned }, () => {
      dispatch({
        type: 'TOGGLE_PIN_SUCCESS',
        id,
        pinned
      })
    })
  }
}
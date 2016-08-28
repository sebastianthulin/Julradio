const {List, Map} = require('immutable')

const article = (state = Map(), action, newProps) => {
  switch (action.type) {
    case 'FETCH_ARTICLES_SUCCESS':
    case 'FETCH_ALL_ARTICLES_SUCCESS':
      return state.merge(newProps)
    case 'FETCH_ARTICLE_SUCCESS':
      return state.merge(action.article)
    case 'UPDATE_ARTICLE_LOCALLY':
      if (!state.get('_id')) state = state.set('user', action.user)
      return state.merge({
        title: action.title,
        content: action.content,
        marked: action.marked
      })
    case 'TOGGLE_PIN_SUCCESS':
      return state.set('pinned', action.pinned)
    default:
      return state
  }
}

const initialState = Map({
  byId: Map(),
  ids: List(),
  editing: null,
  editingId: null
})

const articles = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ARTICLES_SUCCESS':
    case 'FETCH_ALL_ARTICLES_SUCCESS': {
      const articles = action.articles.sort((a, b) => b.date - a.date)
      const ids = articles.map(a => a._id)
      const byId = state.get('byId').withMutations(ctx => {
        articles.forEach(a => {
          ctx.set(a._id, article(ctx.get(a._id), action, a))
        })
      })
      return state.merge({byId, ids})
    }
    case 'FETCH_ARTICLE_SUCCESS': {
      const a = article(state.getIn(['byId', action.id]), action)
      if (state.get('editingId') === action.id) {
        state = state.set('editing', a)
      }
      return state.setIn(['byId', action.id], a)
    }
    case 'EDIT_ARTICLE':
      return state.merge({
        editing: state.getIn(['byId', action.id]) || Map({user: action.user}),
        editingId: action.id
      })
    case 'CANCEL_EDIT':
      return state.merge({
        editing: null,
        editingId: null
      })
    case 'UPDATE_ARTICLE_LOCALLY':
      return state.set('editing', article(state.get('editing'), action))
    case 'TOGGLE_PIN_SUCCESS':
      return state.updateIn(['byId', action.id], a => article(a, action))
    default:
      return state
  }
}

module.exports = articles

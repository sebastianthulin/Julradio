var React = require('react')
var Modal = require('../../../services/Modal')
var TweetStore = require('../../../stores/TweetStore')
var Article = require('./Article')
var TwitterFeed = require('../../reusable/TwitterFeed')

class Front extends React.Component {
  componentWillMount() {
    this.unsubscribe = TweetStore.subscribe(this.handleTweets.bind(this))
    this.setState({
      articles: [{
        id: Math.random().toString(36),
        title: 'Premiär and stuff awesome asdasdfaesf',
        username: 'Oliver Johansson',
        userpic: '/images/berkleyill.jpg',
        html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.</p>'
      }, {
        id: Math.random().toString(36),
        title: 'Tomten',
        username: 'Oliver Johansson',
        userpic: '/images/berkleyill.jpg',
        html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.</p>'
      }]
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleTweets(tweets) {
    this.setState({tweets})
  }

  render() {
    var { articles, tweets } = this.state
    return (
      <div id="front" className="row content">
        <div className="two-thirds column">
          <h1>Blogg</h1>
          {articles.map(article => <Article key={article.id} article={article} />)}
        </div>
        <div className="one-third column">
          {tweets.length > 0 && <span className="hashtagJulradio">#julradio</span>}
          <div className="newTweet">
            <input type="text" placeholder="Skriv en önskning" onClick={Modal.open.bind(null, 'RequestSong')} />
          </div>
          <TwitterFeed tweets={tweets} />
        </div>
      </div>
    )
  }
}

module.exports = Front
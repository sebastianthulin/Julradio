var React = require('react')
var Article = require('./Article')
var TwitterWidget = require('../../TwitterWidget')

class Front extends React.Component {
  componentWillMount() {
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
  render() {
    return (
      <div id="front" className="row content">
        <div className="two-thirds column">
          <h1>Blogg</h1>
          {this.state.articles.map(article => <Article key={article.id} article={article} />)}
        </div>
        <div className="one-third column">
          <TwitterWidget id="539517421674315776" path="https://twitter.com/sarafrostwhisp" />
        </div>
      </div>
    )
  }
}

module.exports = Front
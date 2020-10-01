import React from 'react';
import { Button, Card, Icon, Segment, Modal, Form, Input } from "semantic-ui-react";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ghostposts: [],
      boasts: [],
      roasts: [],
      highest: [],
      type_of_post: '',
      title: '',
      body: '',
      deletekey: ''
    }
  }

  headerStyleObj = {
    fontSize: 45
  }

  scoreStyleObj = {
    fontSize: 25
  }

  handleDelete = (event) => {
    console.log(event.target.value)
    this.setState({ deletekey: event.target.value });
  }

  handleType = (event) => {
    console.log(event.target.value)
    this.setState({type_of_post: event.target.value } );
  }

  handleTitle = (event) => {
    console.log(event.target.value)
    this.setState({title: event.target.value  });
  }

  handleBody = (event) => {
    console.log(event.target.value)
    this.setState({  body: event.target.value } );
  }

  getPosts = (event) => {
    // event.preventDefault()
    fetch(`http://localhost:8000/api/posts/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({ ghostposts: data, boasts: [], roasts: [], highest: [] })
      });
  };

  getBoast = (event) => {
    // event.preventDefault()
    fetch(`http://localhost:8000/api/posts/boast/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({ boasts: data, ghostposts: [], roasts: [], highest: [] })
      });
  };

  getRoast = (event) => {
    // event.preventDefault()
    fetch(`http://localhost:8000/api/posts/roast/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({ roasts: data, ghostposts: [], boasts: [], highest: [] })
      });
  };

  getHighest = (event) => {
    // event.preventDefault()
    fetch(`http://localhost:8000/api/posts/highest_score/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({ highest: data, ghostposts: [], roasts: [], boasts: [] })
      });
  };

  createPost = (event) => {
    console.log(this.state.type_of_post)
    console.log(this.state.title)
    console.log(this.state.body)
    const requestBody = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type_of_post: this.state.type_of_post,
        title: this.state.title,
        body: this.state.body,
      }),
    };
    fetch("http://localhost:8000/api/posts/", requestBody)
      .then((response) => response.json())
      .then((data) =>
        alert(
          `Please write this code down in case you ever want to delete this post: ${data.secret}`
        )
      )
      .then(this.setState({ title: '', body: '', type_of_post: '' }));
    this.getPosts();
  };

  deletePost = (id) => {
    fetch(`http://localhost:8000/api/posts/${id}/?secret=${this.state.deletekey}/`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        alert(data.status)
      });
  };

  submitUpVote = (id, post) => {
    fetch(`http://localhost:8000/api/posts/${id}/up_vote/`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        alert(data.status)
        if (post === 'boast') {
          this.getBoast()
        } else if (post === 'roast') {
          this.getRoast()
        } else if (post === 'high') {
          this.getHighest()
        } else {
          this.getPosts()
        }
      });
  };

  submitDownVote = (id, post) => {
    fetch(`http://localhost:8000/api/posts/${id}/down_vote/`, { method: "POST", })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        alert(data.status)
        if (post === 'boast') {
          this.getBoast()
        } else if (post === 'roast') {
          this.getRoast()
        } else if (post === 'high') {
          this.getHighest()
        } else {
          this.getPosts()
        }
      });
  };

  render() {
    return (
      <div className="App">
        <Segment inverted>
          <header inverted style={this.headerStyleObj}>GhostPost Machine™</header>
          <Segment inverted>
            <Button
              inverted color='orange'
              onClick={this.getPosts}
            >
              ALL POST
            </Button>
            <Button
              inverted color='blue'
              onClick={this.getBoast}
            >
              ALL BOAST
            </Button>
            <Button
              inverted color='red'
              onClick={this.getRoast}
            >
              ALL ROAST
            </Button>
            <Button
              inverted color='yellow'
              onClick={this.getHighest}
            >
              ALL BY HIGHEST TO LOWEST
            </Button>
            <Modal trigger={<Button inverted color='green'>CREATE POST</Button>} basic closeIcon size='small'>
              <Modal.Header>Create A Post</Modal.Header>
              <Modal.Actions>
                <Form form='createPost' onSubmit={() => this.createPost()}>
                  <Input
                    label={{ icon: 'asterisk' }}
                    placeholder='Enter B or R'
                    onChange={(event) => this.handleType(event)}
                    fluid
                  />
                  <br />
                  <Input
                    label={{ icon: 'asterisk' }}
                    placeholder='Enter Title'
                    onChange={(event) => this.handleTitle(event)}
                    fluid
                  />
                  <br />
                  <Input
                    label={{ icon: 'asterisk' }}
                    placeholder='Enter Body'
                    onChange={(event) => this.handleBody(event)}
                    fluid
                  />
                  <br />
                  <Input type="submit" value="Create Post!" fluid />
                </Form>
              </Modal.Actions>
            </Modal>
          </Segment>
          <Segment inverted>
            Welcome to GhostPost Machine™ The GhostPost Machine™ is a website where people can anonymously(no logging in needed) post Boasts or Roasts of whatever they want. There is a body character limit: 280 characters.
          </Segment>
          <Segment inverted>
            {this.state.ghostposts && (
              <Card.Group centered>
                {this.state.ghostposts.map((post) => {
                  return (
                    <Card key={post.id} fluid color={post.type_of_post === 'B' ? "blue" : "red"}>
                      <Card.Content>
                        <Card.Header>{post.title}</Card.Header>
                        <Card.Meta>{post.type_of_post === 'B' ? "Boast" : "Roast"}</Card.Meta>
                        <Card.Description>
                          {post.body}
                        </Card.Description>
                        <Card.Meta>
                          {new Date(post.post_date).toString().slice(0, 25)}
                          <br />

                          <Icon
                            name="arrow alternate circle up"
                            onClick={() => this.submitUpVote(post.id, '')}
                            size='large'
                          />
                          <Icon
                            name="arrow alternate circle down"
                            onClick={() => this.submitDownVote(post.id, '')}
                            size='large'
                          />
                          <h3>{post.score}</h3>
                        </Card.Meta>
                        <Card.Content extra size='small'>
                          <br />
                          <Modal trigger={<Button>Delete Post</Button>} basic closeIcon size='small'>
                            <Modal.Header>Delete This Post</Modal.Header>
                            <Form onSubmit={() => this.deletePost(post.id)}>
                              <Input
                                label={{ icon: 'asterisk' }}
                                placeholder="Post deletion code"
                                action={(event) => this.handleDelete(event)}
                                fluid

                              />
                              <Input type="submit" value="Delete Post!"
                                fluid
                              />
                            </Form>
                          </Modal>
                        </Card.Content>
                      </Card.Content>
                    </Card>
                  );
                })}
              </Card.Group>
            )}
            {this.state.boasts && (
              <Card.Group centered>
                {this.state.boasts.map((post) => {
                  return (
                    <Card key={post.id} fluid color={post.type_of_post === 'B' ? "blue" : "red"}>
                      <Card.Content>
                        <Card.Header>{post.title}</Card.Header>
                        <Card.Meta>{post.type_of_post === 'B' ? "Boast" : "Roast"}</Card.Meta>
                        <Card.Description>
                          {post.body}
                        </Card.Description>
                        <Card.Meta>
                          {new Date(post.post_date).toString().slice(0, 25)}
                          <br />

                          <Icon
                            name="arrow alternate circle up"
                            onClick={() => this.submitUpVote(post.id, 'boast')}
                            size='large'
                          />
                          <Icon
                            name="arrow alternate circle down"
                            onClick={() => this.submitDownVote(post.id, 'roast')}
                            size='large'
                          />
                          <h3>{post.score}</h3>
                        </Card.Meta>
                        <Card.Content extra size='small'>
                          <br />
                          <Modal trigger={<Button>Delete Post</Button>} basic closeIcon size='small'>
                            <Modal.Header>Delete This Post</Modal.Header>
                            <Form onSubmit={() => this.deletePost(post.id)}>
                              <Input
                                label={{ icon: 'asterisk' }}
                                placeholder="Post deletion code"
                                onChange={(event) => this.handleDelete(event)}
                                fluid
                              />
                              <Input type="submit" value="Delete Post!"
                                fluid
                              />
                            </Form>
                          </Modal>
                        </Card.Content>
                      </Card.Content>
                    </Card>
                  );
                })}
              </Card.Group>
            )}
            {this.state.roasts && (
              <Card.Group centered>
                {this.state.roasts.map((post) => {
                  return (
                    <Card key={post.id} fluid color={post.type_of_post === 'B' ? "blue" : "red"}>
                      <Card.Content>
                        <Card.Header>{post.title}</Card.Header>
                        <Card.Meta>{post.type_of_post === 'B' ? "Boast" : "Roast"}</Card.Meta>
                        <Card.Description>
                          {post.body}
                        </Card.Description>
                        <Card.Meta>
                          {new Date(post.post_date).toString().slice(0, 25)}
                          <br />

                          <Icon
                            name="arrow alternate circle up"
                            onClick={() => this.submitUpVote(post.id, 'roast')}
                            size='large'
                          />
                          <Icon
                            name="arrow alternate circle down"
                            onClick={() => this.submitDownVote(post.id, 'roast')}
                            size='large'
                          />
                          <h3>{post.score}</h3>
                        </Card.Meta>
                        <Card.Content extra size='small'>
                          <br />
                          <Modal trigger={<Button>Delete Post</Button>} basic closeIcon size='small'>
                            <Modal.Header>Delete This Post</Modal.Header>
                            <Form onSubmit={() => this.deletePost(post.id)}>
                              <Input
                                label={{ icon: 'asterisk' }}
                                placeholder="Post deletion code"
                                onChange={(event) => this.handleDelete(event)}
                                fluid
                              />
                              <Input type="submit" value="Delete Post!"
                                fluid
                              />
                            </Form>
                          </Modal>
                        </Card.Content>
                      </Card.Content>
                    </Card>
                  );
                })}
              </Card.Group>
            )}
            {this.state.highest && (
              <Card.Group centered>
                {this.state.highest.map((post) => {
                  return (
                    <Card key={post.id} fluid color={post.type_of_post === 'B' ? "blue" : "red"}>
                      <Card.Content>
                        <Card.Header>{post.title}</Card.Header>
                        <Card.Meta>{post.type_of_post === 'B' ? "Boast" : "Roast"}</Card.Meta>
                        <Card.Description>
                          {post.body}
                        </Card.Description>
                        <Card.Meta>
                          {new Date(post.post_date).toString().slice(0, 25)}
                          <br />

                          <Icon
                            name="arrow alternate circle up"
                            onClick={() => this.submitUpVote(post.id, 'high')}
                            size='large'
                          />
                          <Icon
                            name="arrow alternate circle down"
                            onClick={() => this.submitDownVote(post.id, 'high')}
                            size='large'
                          />
                          <h3>{post.score}</h3>
                        </Card.Meta>
                        <Card.Content extra size='small'>
                          <br />
                          <Modal trigger={<Button>Delete Post</Button>} basic closeIcon size='small'>
                            <Modal.Header>Delete This Post</Modal.Header>
                            <Form onSubmit={() => this.deletePost(post.id)}>
                              <Input
                                label={{ icon: 'asterisk' }}
                                placeholder="Post deletion code"
                                onChange={(event) => this.handleDelete(event)}
                                fluid
                              />
                              <Input
                                type="submit"
                                value="Delete Post!"
                                fluid
                              />
                            </Form>
                          </Modal>
                        </Card.Content>
                      </Card.Content>
                    </Card>
                  );
                })}
              </Card.Group>
            )}
          </Segment>
        </Segment>
      </div>
    );
  }
}

export default App;

// {this.state.ghostposts.map((post, id)=>
//   <div key = {id} >
//     <ul>
//       <li>Title:{post.title}</li>
//       <li>Body:{post.body}</li>
//       <li>Score:{post.score}</li>
//     </ul>
//     <button>Up Vote</button>
//     <button>Down Vote</button>
//   </div>
// )}
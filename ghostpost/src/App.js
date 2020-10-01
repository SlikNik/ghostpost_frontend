import React from 'react';
import { Button, Card, Icon, Dropdown, Modal } from "semantic-ui-react";

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      ghostposts : [],
      post : {},
      deletekey : ''
    }
  }

  handleDelete(event){
    // event.preventDefault();
    this.setState({ deletekey : event.target.value});
  }

  componentDidMount(){
    fetch(`http://localhost:8000/api/posts`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({ghostposts : data})
      });
  };

  getPosts(){
    fetch(`http://localhost:8000/api/posts`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({ghostposts : data})
      });
  };

 getBoast(){
    fetch(`http://localhost:8000/api/posts/boast/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({ghostposts : data})
      });
  };

  getRoast(){
    fetch(`http://localhost:8000/api/posts/roast/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({ghostposts : data})
      });
  };

  getHighest(){
    fetch(`http://localhost:8000/api/posts/highest_score/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.setState({ghostposts : data})
      });
  };
  
  deletePost(event, id, secret){
    // event.preventDefault();
    let requestBody = {
      method: "DELETE",
    };
    fetch(`http://localhost:8000/api/posts/${id}/?secret=${secret}/`, requestBody)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        alert(data.status)
      });
    this.getPosts();
  };

 submitUpVote(id){
    fetch(`http://localhost:8000/ghostposts/${id}/upvote/`, { method: "POST" });
    this.getPosts();
  };

  submitDownVote(id){
    fetch(`http://localhost:8000/ghostposts/${id}/downvote/`, {
      method: "POST",
    });
    this.getPosts();
  };

  render(){
    return (
      <div className="App">
        <header className="App-header">GhostPost</header>
        {this.state.ghostposts && (
        <Card.Group centered>
          {this.state.ghostposts.map((post) => {
            return (
              <Card key={post.pk} fluid color={post.type_of_post === 'B' ? "blue" : "red"}>
                <Card.Content>
                  <Card.Header>{post.title}</Card.Header>
                  <Card.Description>
                    {post.type_of_post === 'B' ? "Boast" : "Roast"}
                    <br/>
                    {post.body}
                  </Card.Description>
                  <Card.Meta>
                    {new Date(post.post_date).toString().slice(0, 25)}
                  </Card.Meta>
                  <Card.Content extra size='small'>
                    <Icon
                      name="arrow alternate circle up"
                      onClick={this.submitUpVote(post.pk)}
                    />
                    <Icon
                      name="arrow alternate circle down"
                      onClick={this.submitDownVote(post.pk)}
                    />
                    {post.score}
                  
                  <br />
                  <Modal trigger={<Button>Delete Post</Button>} basic closeIcon size='small'>
                    <Modal.Header>Delete This Post</Modal.Header>
                    <form onSubmit={this.deletePost(post.pk, this.state.deletekey)}>
                      <input
                        name="deleteFormInput"
                        placeholder="Post deletion code"
                        value={this.state.deletekey || ""}
                        onChange={(event) => this.handleDelete(event)}
                      />
                      <input type="submit" value="Delete Post!" />
                    </form>
                  </Modal>
                  </Card.Content>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      )}
 
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
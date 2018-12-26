import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ImageList from './components/image-list/image-list';
import { data } from './data';

const RootDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.span`
  font-size: 2rem;
  font-weight: 300;
`;
const Shit = styled.span`
  font-size: 1rem;
  font-weight: 200;
`;

class App extends Component {
  state = {
    loadingPending: false,
    count: 0,
    loaded: false,
    images: [...data],
    currentShowImage: []
  };

  componentDidMount() {
    window.addEventListener('scroll', this.scroll, false);
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scroll, false);
  }

  getImages = async () => {
    await this.setState({
      loadingPending: true
    });

    await axios
      .get('https://api.unsplash.com/photos/random', {
        params: {
          client_id:
            'fac7e49f6253e3c8355899e12af4cec8272887d0d7c340adcd2b192805f8281b',
          count: 30
        }
      })
      .then(res => {
        console.log(res);
        const newImages = res.data.map(image => image.urls.small);
        this.setState({
          images: [...this.state.images, ...newImages]
        });
      })
      .catch(err => {
        this.setState({ loaded: true });
      });

    await this.setState({
      loadingPending: false
    });
  };

  scroll = () => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body;

    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;

    console.log(scrollHeight - innerHeight - scrollTop);

    if (
      scrollHeight - innerHeight - scrollTop < 100 &&
      this.state.loadingPending === false
    ) {
      this.getImages();
    }
  };

  render() {
    return (
      <RootDiv className="App">
        <Header>
          <Title>Unsplash infinite scroll</Title>
          <Shit>Hello I am Lee ji hoon</Shit>
        </Header>
        <ImageList images={this.state.images} />
      </RootDiv>
    );
  }
}

export default App;

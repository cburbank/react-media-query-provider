// @flow

import React, { Component, type Node } from 'react'

import debounce from './utils/debounce'
import defaults from './utils/defaults'

const { Provider, Consumer } = React.createContext()

export { Consumer as MediaQueryConsumer }

type Props = {
  children: Node,
  mediaQueries: {
    [key: string]: string
  },
  wait: number
}

type State = {
  matches: {
    [key: string]: boolean
  }
}

export class MediaQueryProvider extends Component<Props, State> {
  static defaultProps = {
    mediaQueries: defaults,
    wait: 120
  }

  state = {
    matches: {}
  }

  matches = {}

  mediaQueryLists = {}

  componentDidMount() {
    this.createMediaQueryLists()
    this.addListeners()
    this.setInitialState()
  }

  componentWillUnmount() {
    Object.keys(this.mediaQueryLists).forEach((key) => {
      this.mediaQueryLists[key].removeListener(this.handleMediaQueryChange)
    })
  }

  createMediaQueryLists() {
    const { mediaQueries } = this.props
    const arr = Object.keys(mediaQueries).map(key => ({
      [key]: window.matchMedia(mediaQueries[key])
    }))

    this.mediaQueryLists = Object.assign(...arr)
  }

  addListeners() {
    Object.keys(this.mediaQueryLists).forEach((key) => {
      this.mediaQueryLists[key].addListener(this.handleMediaQueryChange)
    })
  }

  setInitialState() {
    const matchesArray = Object.keys(this.mediaQueryLists).map(key => ({
      [key]: this.mediaQueryLists[key].matches
    }))

    this.matches = Object.assign(...matchesArray)
    this.rerender()
  }

  handleMediaQueryChange = (ev: MediaQueryListEvent) => {
    const query = Object.keys(this.mediaQueryLists).find(
      key => this.mediaQueryLists[key].media === ev.media
    )

    this.matches = { ...this.matches, [query]: ev.matches }
    this.rerender()
  };

  rerender = debounce(() => {
    this.setState({ matches: this.matches })
  }, this.props.wait);

  render() {
    const { matches } = this.state

    return (
      <Provider value={{ matches }}>
        {this.props.children}
      </Provider>
    )
  }
}

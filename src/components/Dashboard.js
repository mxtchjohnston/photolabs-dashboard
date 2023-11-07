import React, { Component } from "react";

import classnames from "classnames";

import Loading from "./Loading";
import Panel from "./Panel";

import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads
 } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    value: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    value: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    value: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    value: getUserWithLeastUploads
  }
];


class Dashboard extends Component {
  state = { 
    loading: true,
    focused: null,
    photos: [],
    topics: [],
  };

  selectPanel = (id) => {
    this.setState(prev => ({
      focused: prev.focused !== null ? null : id
    }));
  }

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem('foucsed'));

    if (focused) {
      this.setState({focused});
    }

    const urlsPromise = [
      'api/photos',
      'api/topics'
    ].map(url => fetch(url).then(resp => resp.json()));

    Promise.all(urlsPromise)
      .then(([photos, topics]) => {
        this.setState({
          loading: false,
          photos,
          topics
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem('focused', JSON.stringify(this.state.focused));
    }
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
     });

    if (this.state.loading) {
      return <Loading/>;
    }
    
    const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
      .map(elem => <Panel key={elem.id} onSelect={event => this.selectPanel(elem.id)} label={elem.label} value={elem.value(this.state)}/>)

    return <main className={dashboardClasses}> {panels} </main>;
  }
}

export default Dashboard;

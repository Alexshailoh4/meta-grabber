import React, { Component } from 'react';
import axios from 'axios';

import Button from './button';
import Autocomplete from './autocomplete';
import { makeRequestCreator } from '../util/request';

import CrossIcon from '../icons/cross.svg';

export default class TvShowInput extends Component {

  constructor(props) {
    super(props);

    this.get = makeRequestCreator();

    this.state = {
      results: [],
    };
  }

  async search(query) {
    try {
      const response = await this.get(
        `/search/tv?language=${this.props.metaDataLang}&query=${query}`
      );
      this.setState({ results: response.data.results });
    } catch(error) {
      if (axios.isCancel(error)) {
        // ignore canceled request
      } else {
        this.props.onMessages({
          id: 'search-error',
          text: `Failed to search tv show: ${error}`,
          type: 'error',
          dismissable: true,
        })
      };
    }
  }

  handleChange({ target: { value: query } }) {
    this.props.onChange(query);

    if (!query || query.trim().length < 3) {
      this.setState({ results: [] });
      this.props.onSelect({ id: null });
      return;
    }
    this.search(query.trim());
  }

  handleSelect(query, tvShowItem) {
    this.props.onChange(query);
    this.props.onSelect(tvShowItem);
  }

  clearInput() {
    this.props.onChange('');
    this.props.onSelect({ id: null });
    this.setState({ results: [] });
  }

  render () {
    return (
      <div className="tv-show-input">
        <Autocomplete
          placeholder="Search TV show..."
          focusable={this.props.openState}
          onChange={this.handleChange.bind(this)}
          onSelect={this.handleSelect.bind(this)}
          items={this.state.results}
          getItemValue={item => item.name}
          getItemKey={item => item.id}
          getDisplayValue={item => `${item.name} (${item.first_air_date.substr(0, 4)})`}
          value={this.props.query}
          showDropdown={this.state.results.length > 0}
        />
        <Button
          className="tv-show-input__clear"
          type="delete"
          disabled={!this.props.query}
          icon={<CrossIcon />}
          onClick={this.clearInput.bind(this)}
        />
      </div>
    );
  }
}

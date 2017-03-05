import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';
import { routeCodes } from '../../routes';

export default class Menu extends Component {
  constructor() {
    super();

    this.state = {
      active: false,
      disabled: false,
    };
  }

  render() {
    const {
      active,
    } = this.state;

    const menuClass = active ? 'Menu Menu--active' : 'Menu';

    return (
      <div className={ menuClass }>
        <IndexLink to={ routeCodes.DASHBOARD }>
          Dashboard
        </IndexLink>
        <Link to={ routeCodes.ABOUT }>
          About
        </Link>
        <Link to='404'>
          404
        </Link>
      </div>
    );
  }
}

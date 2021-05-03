import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Input, Menu } from 'semantic-ui-react';

import { AuthContext } from '../Context/Auth';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const { pathname } = useLocation();

  const path = pathname === '/' ? 'home' : pathname.substr(1);

  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Menu secondary size='massive' color='teal'>
      <Menu.Item
        name='home'
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to='/'
      />

      <Menu.Menu position='right'>
        <Menu.Item>
          <Input icon='search' placeholder='Search...' />
        </Menu.Item>

        {user ? (
          <Menu.Item name='logout' onClick={logout} />
        ) : (
          <>
            <Menu.Item
              name='login'
              active={activeItem === 'login'}
              onClick={handleItemClick}
              as={Link}
              to='/login'
            />
            <Menu.Item
              name='register'
              active={activeItem === 'register'}
              onClick={handleItemClick}
              as={Link}
              to='/register'
            />
          </>
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default Header;

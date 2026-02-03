import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { OrdersContext } from '../../providers/OrdersProvider';
import { AuthContext } from '../../contexts/AuthContext';

import {
  AuthLink,
  HeaderActions,
  HeaderContainer,
  IconLink,
  LocationBadge,
  LogoutButton,
  UserAvatar,
  UserMenu,
  UserMeta,
} from './styles';

import { GrLocation } from 'react-icons/gr';
import { IoIosCart } from 'react-icons/io';

import { ImHistory } from 'react-icons/im';

import logo from '../../assets/logo.png';

export const Header = () => {
  const { cart } = useContext(OrdersContext);
  const { user, isAuthenticated, signOut } = useContext(AuthContext);

  const isCartEmpty = cart.length === 0;

  const userLabel = user?.name ?? user?.email;
  return (
    <HeaderContainer>
      <Link to="/">
        <img src={logo} alt="Logo - Coffee Delivery" />
      </Link>
      <HeaderActions>
        <LocationBadge>
          <GrLocation />
          <span>Minas Gerais, BR</span>
        </LocationBadge>
        <IconLink to="/order" title="Acessar o Carrinho">
          <IoIosCart />
          {!isCartEmpty && <span>{cart.length}</span>}
        </IconLink>
        <IconLink to="/history" title="Acessar o histórico">
          <ImHistory />
        </IconLink>
        {!isAuthenticated ? (
          <AuthLink to="/login">Entrar</AuthLink>
        ) : (
          <UserMenu>
            {user?.avatarUrl ? (
              <UserAvatar src={user.avatarUrl} alt={userLabel ?? 'Usuário'} />
            ) : (
              <UserAvatar
                src="https://via.placeholder.com/40"
                alt={userLabel ?? 'Usuário'}
              />
            )}
            <UserMeta>
              <strong>{userLabel}</strong>
              <span>{user?.email}</span>
            </UserMeta>
            <LogoutButton type="button" onClick={signOut}>
              Sair
            </LogoutButton>
          </UserMenu>
        )}
      </HeaderActions>
    </HeaderContainer>
  );
};

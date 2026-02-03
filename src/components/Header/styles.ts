import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeaderContainer = styled.header`
  width: 100%;
  height: 10.4rem;
  padding: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.4rem;
  flex-wrap: wrap;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const LocationBadge = styled.div`
  height: 3.8rem;
  border-radius: 5px;
  padding: 0 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  background-color: ${({ theme }) => theme.colors['6-color']};
  color: ${({ theme }) => theme.colors['4-color']};

  & span {
    font-size: ${({ theme }) => theme.fonts.sizes.small3};
  }

  & svg {
    font-size: 2rem;
  }

  & path {
    stroke: ${({ theme }) => theme.colors['4-color']};
  }
`;

export const IconLink = styled(Link)`
  position: relative;
  height: 3.8rem;
  width: 3.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 2.2rem;
  background-color: ${({ theme }) => theme.colors['3-color']};
  color: ${({ theme }) => theme.colors['1-color']};
  text-decoration: none;

  & span {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -7px;
    right: -7px;
    color: ${({ theme }) => theme.colors['base-light-color']};
    background-color: ${({ theme }) => theme.colors['1-color']};
    font-size: ${({ theme }) => theme.fonts.sizes.small2};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
  }
`;

export const AuthLink = styled(Link)`
  height: 3.8rem;
  padding: 0 1.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: ${({ theme }) => theme.fonts.sizes.small3};
  font-weight: 700;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors['4-color']};
  color: ${({ theme }) => theme.colors['base-light-color']};
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(0.9);
  }
`;

export const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors['base-card']};
`;

export const UserAvatar = styled.img`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const UserAvatarFallback = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors['4-color']};
  color: ${({ theme }) => theme.colors['base-light-color']};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.sizes.small2};
  font-weight: 700;
  text-transform: uppercase;
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & strong {
    font-size: ${({ theme }) => theme.fonts.sizes.small3};
    color: ${({ theme }) => theme.colors['base-title']};
  }

  & span {
    font-size: ${({ theme }) => theme.fonts.sizes.small2};
    color: ${({ theme }) => theme.colors['base-text']};
  }
`;

export const LogoutButton = styled.button`
  border: 0;
  background: transparent;
  font-size: ${({ theme }) => theme.fonts.sizes.small3};
  font-weight: 700;
  color: ${({ theme }) => theme.colors['1-color']};
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.colors['base-hover']};
  }
`;

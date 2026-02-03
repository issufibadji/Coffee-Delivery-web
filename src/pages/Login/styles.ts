import styled from 'styled-components';

export const LoginContainer = styled.main`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 0 6rem;
`;

export const LoginCard = styled.div`
  width: min(90%, 42rem);
  background-color: ${({ theme }) => theme.colors['base-card']};
  border-radius: 8px;
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
`;

export const LoginTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.family.secondary};
  font-size: ${({ theme }) => theme.fonts.sizes.big};
  color: ${({ theme }) => theme.colors['base-title']};
`;

export const LoginDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.small4};
  color: ${({ theme }) => theme.colors['base-text']};
`;

export const LoginButton = styled.button`
  border: 0;
  border-radius: 6px;
  padding: 1.2rem 1.6rem;
  font-size: ${({ theme }) => theme.fonts.sizes.small4};
  font-weight: 700;
  text-transform: uppercase;
  background-color: ${({ theme }) => theme.colors['4-color']};
  color: ${({ theme }) => theme.colors['base-light-color']};
  cursor: pointer;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(0.9);
  }
`;

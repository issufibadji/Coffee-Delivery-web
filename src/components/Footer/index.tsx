import { FooterContainer } from './styles';

import { VscGithub } from 'react-icons/vsc';
import { BsLinkedin } from 'react-icons/bs';

import { ThemeSwitcher } from '../ThemeSwitcher';

import logo from '../../assets/logo.png';

export const Footer = () => {
  return (
    <FooterContainer>
      <a href="https://github.com/issufiBadji">
        <VscGithub />
      </a>
      <img src={logo} alt="Logo - Coffee Delivery" />
      <a href="https://www.linkedin.com/in/issufibadji/">
        <BsLinkedin />
      </a>
      <ThemeSwitcher />
    </FooterContainer>
  );
};

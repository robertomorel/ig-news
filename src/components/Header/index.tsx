import { memo } from 'react';


import SignInButton from "../SignInButton";

import styles from './styles.module.scss';
import { ActiveLink } from '../ActiveLink';

function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news"/>

        <nav>
          <ActiveLink activeClassName={styles.active } href="/">
            <a>Home</a>
          </ActiveLink>
          {/* O 'prefetch' faz com que a página da rota já seja pré-carredada */}
          <ActiveLink activeClassName={styles.active }  href="/posts" prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
};


export default memo(Header);
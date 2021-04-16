import { memo } from "react";
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
/**
 * signIn -> função que espera receber o tipo de autenticação ('github') para autenticar o usuário
 *           As informações do usuário ficam armazenadas nos cookies
 * signOut -> desativa a sessão do usuário
 */
import { signIn, signOut, useSession } from 'next-auth/client';

import  styles from "./styles.module.scss";

function SignInButton() {
  // useSession é um hook do next-auth/client que informa se o usuário está com uma sessão ativa, ou não
  const [session] = useSession();

  console.log(session);

  return session ? (
    <button type="button" className={styles.signInButton} onClick={() => signOut()}>
      <FaGithub color="#04d361" />
        {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button type="button" className={styles.signInButton} onClick={() => signIn('github')}>
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  )
}

export default memo(SignInButton)
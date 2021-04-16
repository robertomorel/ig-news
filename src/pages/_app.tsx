/**
 * Colocamos o _ antes do app.tsx para que este componente fique "por cima/por volta"
 * de todas as páginas. Sempre que o user troca de tela, o _app.tsx é recarregado
 */
import { AppProps } from "next/app";
import { Provider as NextAuthProvider} from 'next-auth/client';

import Header from "../components/Header";

import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp

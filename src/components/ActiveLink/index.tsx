import Link, { LinkProps } from "next/link";
import { useRouter } from 'next/router';
/**
 * O "cloneElement", nós podemos clonar um elemento react e alterar coisas nele
 */
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement; //Quero receber um elemento react, que no caso será o <a>
  activeClassName: string;
}

export function ActiveLink ({ children, activeClassName, ...rest }: ActiveLinkProps) {
  const {asPath} = useRouter();

  // Se o link ativo for igual ao rest.href, o activeClassName é passado para o <a> 
  const className = asPath === rest.href ? activeClassName : '';

  /**
   * Vamos clona o elemento "children", que é o <a> e vou adicionar como propriedade a className
   */
  return (
    <Link {...rest} >
      {cloneElement(children, {
        className
      })}
    </Link>
  )
}
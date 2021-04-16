import { GetStaticProps } from "next"
import Head from "next/head"
import { RichText } from "prismic-dom"
import styles from '../post.module.scss';
import { getPrismicClient } from "../../../services/prismic"
import Link from "next/link";
import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if(session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  },[session])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{__html: post.content }}  />
        
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

/**
 * fallback
 *    true: Sempre que o user tentar acessar uma rota que ainda não foi acessada estaticamente, 
 *          o next vai gerar automaticamente 
 *    false: Se o user tentar acessar uma rota que ainda não foi acessada estaticamente (pelo build), 
 *           o next não vai reconhecer o path e vai dar 404
 *    blocking: Quando acessamos um conteúdo que ainda não foi gerado de forma estática, 
 *              vai tentar carregar o conteúdo novo, mas na camada do next ServerSideRendering 
 *              e quando estiver tudo carregado, vai mostrar o HMTL
 */
export const getStaticPaths = () => {
  return {
    paths: [], // Quero que todos os posts sejam mostrados no preview de forma estática
    //paths: [{ params: { slug: 'slug1' }}], //Quero apenas que o slug1 seja mostrado no preview
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({  params }) => {
  const { slug } = params;

  const prismic = getPrismicClient()

  const response = await prismic.getByUID('post', String(slug), {});

  const post  = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(1,3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('es-PE', { 
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return { 
    props: {post},
    revalidate: 60 * 30, //30 min
  }
}
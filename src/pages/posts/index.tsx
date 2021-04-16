import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
//RichText -> Conversor de formato prismic para texto ou html
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({posts}: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`}>
              <a key={post.slug} >
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  // Buscando dados de dentro do prismic
  const response = await prismic.query(
    // Quero buscar (api predicate) onde tipo do document é 'publication'
    [
    Prismic.predicates.at('document.type', 'publication')
    ], {
      fetch: ['publication.title', 'publication.content'], // Quais dados quero buscar?
      pageSize: 100, // Qntos posts quero trazer?
    }
  )

  console.log(response)

  // Formatando os dados logo após consumir os valores da API
  /**
   * Sempre evitar formatar dados na interface
   */
  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('es-PE', { 
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    }
  })

  return { 
    props : {posts }
  }
}
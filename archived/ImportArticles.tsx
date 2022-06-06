import Image from "next/image";
import styles from "@/styles/Import.module.scss";
import tickIcon from '@/images/icons/tick.svg';
import noArticles from '@/images/elements/no-articles.svg';
import {
  getDefaultArticleImage
} from '@/components/getDefaultPreviewImage';
import { DefaultHead } from "../layouts/DefaultHead";
import { StaticNavbar } from "../layouts/Navbar";
import { Article, GetArticlesServerSide } from "@/types/props";
import { useState, useEffect } from "react";
import { shortenSentence } from "@/lib/sanitize";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { Footer } from "../layouts/Footer";

export const ImportArticles = ({
  articles,
  user
}: GetArticlesServerSide) => {
  const router = useRouter();
  const [selected, setSelectedArticle] = useState<Article>();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey || publicKey.toString() !== router.query.publicKey) {
      router.push('/')
    }
  }, [publicKey, router, articles]);

  const handleContinueClick = () => {
    if (!selected) return;
    router.push(`/edit/${user?.username}/${selected.slug}`);
  }

  return (
    <div className="container-flex">
      <DefaultHead />
      <StaticNavbar />
      <div className={styles.container}>
        <div className={styles.maxWidth}>
          <div className={styles.spaceBetween}>
            <div style={{ maxWidth: '42rem' }}>
              <h1
                style={{ fontSize: '3.4rem' }}
                className="heading">Import Articles</h1>
              <p className="normal-text">
                Import existing articles from your blog to become on-chain with a single click
              </p>
            </div>
            <div className={styles.importButton}>
              <button
                style={{
                  cursor: selected ? "pointer" : "default",
                  opacity: selected ? '' : '0.75'
                }}
                onClick={handleContinueClick}
                className="main-btn">Continue</button>
            </div>
          </div>
          <div className={styles.articleGrid}>
            {articles && articles?.map((article) => (
              <div
                key={article.title}
                className={styles.article}
                onClick={() => setSelectedArticle(article)}
                style={{
                  outline: article === selected ? '0.1rem solid rgba(19, 19, 19, 1)' : ''
                }}
              >
                <img
                  className={styles.articleImage}
                  src={article.image_url || getDefaultArticleImage(article, user)}
                  alt=""
                />
                <div
                  style={{ display: selected === article ? 'block' : 'none' }}
                  className={styles.articleSelectedTick}>
                  <Image src={tickIcon} alt="" />
                </div>
                <div className={styles.articleContent}>
                  <p className="subheading sm">{article.title}</p>
                  <p className="normal-text">{shortenSentence(
                    article.description,
                    80
                  )}</p>
                </div>
              </div>
            ))}
          </div>
          {articles && articles.length === 0 && (
            <div className="m-0-auto">
              <img src={noArticles.src} alt="" />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
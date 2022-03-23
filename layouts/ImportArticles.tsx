import styles from "@/styles/Import.module.scss";
import tickIcon from '@/images/icons/tick.svg';
import { DefaultHead } from "./DefaultHead";
import { StaticNavbar } from "./Navbar";
import { Article, GetArticlesServerSide } from "@/types/props";
import { useState } from "react";
import Image from "next/image";

export const ImportArticles = ({
  articles
}: GetArticlesServerSide) => {
  const [selected, setSelectedArticle] = useState<Article>();
  return (
    <div>
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
                  src={article.image_url}
                  alt=""
                />
                {selected === article && (
                  <div className={styles.articleSelectedTick}>
                    <Image src={tickIcon} alt="" />
                  </div>
                )}
                <div className={styles.articleContent}>
                  <p className="subheading sm">{article.title}</p>
                  <p className="normal-text">{article.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
import styles from '@/styles/Feed.module.scss';

// Icons
import arrowRight from '@/images/icons/arrow-right.svg';

// Search Bar Components
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  Configure,
  SearchBox
} from 'react-instantsearch-dom';
import { ALGOLIA_APPLICATION_ID } from '@/lib/config/constants';
import { User } from '@prisma/client';
import { useState } from 'react';

// Other Components
import Link from 'next/link';
import ClickAwayListener from 'react-click-away-listener';


const searchClient = algoliasearch(
  ALGOLIA_APPLICATION_ID,
  process.env["NEXT_PUBLIC_ALGOLIA_SEARCH_KEY"]
);

function Hit(props: {
  hit: User
}) {
  const user = props.hit;
  return (
    <Link href={'/' + user.username}>
      <a>
        <div className={styles.hitItem}>
          <div className='flex'>
            <img className={styles.hitPfp} src={user.image_url || ''} alt="" />
            <div>
              <p className="text size-14 gray-800 weight-600 nm text-align-left">{user.name}</p>
              <p className="text size-14 gray-400 weight-500 nm text-align-left mt-0-5">{user.username}</p>
            </div>
          </div>
          <img className="mr-2" src={arrowRight.src} alt="" />
        </div>
      </a>
    </Link>
  )
};

function SearchBar() {
  const [showHits, setShowHits] = useState(false);

  return (
    <div className={styles.searchBar}>
      <InstantSearch
        indexName="users"
        searchClient={searchClient}
      >
        <ClickAwayListener onClickAway={() => {
          setShowHits(false);
        }}>
          <div>
            {/* Correct types haven't been implemented for this module */}
            {/* @ts-expect-error */}
            <SearchBox onFocus={() => setShowHits(true)}
              className={styles.searchInput}
              translations={{
                placeholder: "Search for users..."
              }}
            />
            <Configure hitsPerPage={6} />
            <div
              style={{ display: showHits ? 'block' : 'none' }}
              className={styles.searchResults}
            >
              <Hits hitComponent={Hit} />
            </div>
          </div>
        </ClickAwayListener>
      </InstantSearch>
    </div>
  )
};

export { SearchBar }
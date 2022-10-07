// Styles
import styles from '@/styles/Feed.module.scss';

// Icons
import searchIcon from '@/images/icons/search.svg';
import arrowRight from '@/images/icons/arrow-right.svg';

// Search Bar Components
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  Configure,
  connectSearchBox
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

function CustomSearchBox ({
  currentRefinement,
  refine,
  showResults
}: any) {

  return (
    <div className={styles.searchInputParent}>
      <input
        className={styles.searchInput}
        type="search"
        placeholder="Search for a user"
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
        onFocus={() => showResults(true)}
      />
      <img
        className="mr-1-5"
        src={searchIcon.src}
        alt=""
      />
    </div>
  )
}


function SearchBar() {
  const [showHits, setShowHits] = useState(false);

  const SearchBox = connectSearchBox((args) =>
    <CustomSearchBox
      {...args}
      showResults={setShowHits}
    />
  );

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
            <SearchBox />
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
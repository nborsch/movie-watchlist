export default function Header(props){
  return (
    <header>
      <h1>{props.isSearch ? 'Find your film' : 'My watchlist'}</h1>
      <nav><a onClick={props.togglePage} href={null}>{props.isSearch ? 'My watchlist' : 'Find your film'}</a></nav>
      <form action={props.searchMovies}>
        <input name="search-query" type="search" placeholder="Search for a movie" />
        <button type="submit">Search</button>
      </form>
    </header>
  )
}
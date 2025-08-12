export default function Movie(props){

    return (
        <div className='movie'>
            <img src={props.cover} />
            <div>
            <p className='movie-info'>
                <span className='movie-title'>{props.title}</span> 
                <img className='icon-star' src='./icon-star.png' /> 
                <span className='rating'>{props.rating}</span>
            </p>
            <div className='movie-extras'>
                <span>{props.duration}</span>
                <span>{props.genres}</span>
                <a href={null} onClick={() => props.onClick(props.id)} className='movie-add-watchlist'>
                <img src={props.isInWatchlist ? './icon-remove.png' : './icon-add.png'} /> 
                {props.isInWatchlist ? 'Remove' : 'Watchlist'}
                </a>
            </div>
            <p className='movie-description'>{props.description}</p>
            </div>
        </div>
    )
}
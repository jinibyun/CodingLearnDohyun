const cardStyle = {
  width: '280px',
  borderRadius: '20px',
  overflow: 'hidden',
  background: '#ffffff',
  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.16)',
  border: '1px solid rgba(15, 23, 42, 0.08)',
}

const posterStyle = {
  display: 'block',
  width: '100%',
  height: '360px',
  objectFit: 'cover',
}

const bodyStyle = {
  padding: '18px 20px 20px',
}

const titleStyle = {
  margin: '0 0 8px',
  fontSize: '1.4rem',
  fontWeight: 700,
  color: '#111827',
}

const ratingStyle = {
  margin: 0,
  fontSize: '1rem',
  color: '#4b5563',
}

function MovieCard({ title, rating, url }) {
  
    return (

    <article style={cardStyle} aria-label="영화 카드">
        <img
            src={url}
            alt={`${title} 영화 포스터`}
            style={posterStyle}
        />
        <div style={bodyStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={ratingStyle}>{rating}</p>
        </div>
    </article>

  )
}

export default MovieCard
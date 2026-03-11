import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from '../../assets/react.svg'
import viteLogo from '/vite.svg'

const heroSlides = [
  {
    id: 1,
    title: 'Apnée au Blue Hole',
    subtitle: 'Découvrez le spot mythique de Dahab dans un cadre sécurisé.',
    imageUrl: '/assets/blue-hole-from-above.jpg',
  },
  {
    id: 2,
    title: 'Reefs et vie sous-marine',
    subtitle: 'Plongez au milieu des coraux et des bancs de poissons colorés.',
    imageUrl: '/assets/reef-at-the-blue-hole.jpg',
  },
  {
    id: 3,
    title: 'Sessions encadrées en petit groupe',
    subtitle: 'Encadrement par instructeurs certifiés, matériel adapté et ambiance conviviale.',
    imageUrl: '/assets/freediving-gear.jpg',
  },
]

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <>
      <section className="card" style={{ textAlign: 'center' }}>
        <h2>Une plateforme dédiée à l’apnée</h2>
        <p style={{ marginBottom: '0.75rem' }}>
          Notre plateforme met en relation des instructeurs d’apnée qualifiés et des élèves
          souhaitant découvrir ou progresser dans cette discipline.
        </p>
        <p>
          Grâce à un système de réservation simple et rapide, chacun peut trouver un cours adapté à
          son niveau — débutant, intermédiaire ou avancé — et réserver facilement une séance avec
          un instructeur.
        </p>
      </section>

      <section className="hero-carousel" aria-label="Mise en avant des cours d’apnée">
        <div
          className="hero-slide"
          style={{ backgroundImage: `url(${heroSlides[currentSlide].imageUrl})` }}
        >
          <div className="hero-overlay">
            <p className="hero-kicker">ApneaFlow Dahab</p>
            <h1 className="hero-title">{heroSlides[currentSlide].title}</h1>
            <p className="hero-subtitle">{heroSlides[currentSlide].subtitle}</p>
            <div className="hero-cta-wrapper">
              <Link to="/reserver" className="hero-cta-button">
                Reserve ton premier cours
              </Link>
              <Link to="/inscription" className="hero-cta-button hero-cta-button--secondary">
                Inscris toi
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-dots" role="tablist" aria-label="Changer de visuel">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`hero-dot ${index === currentSlide ? 'hero-dot--active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Aller au visuel ${index + 1}`}
              aria-pressed={index === currentSlide}
            />
          ))}
        </div>
      </section>

      <section className="card" style={{ textAlign: 'center' }}>
        <h2>Découvrir l’apnée</h2>
        <p style={{ marginBottom: '0.75rem' }}>
          L’apnée est une discipline qui consiste à retenir sa respiration pour évoluer sous l’eau,
          sans équipement de plongée respiratoire. Accessible à tous, elle permet de découvrir le
          monde sous-marin d’une manière calme et naturelle, en se concentrant sur la respiration,
          la relaxation et le contrôle du corps.
        </p>
        <p style={{ marginBottom: '0.75rem' }}>
          Au-delà de l’aspect sportif, l’apnée apporte de nombreux bienfaits. Elle aide à mieux
          gérer le stress grâce aux techniques de respiration, améliore la concentration et favorise
          une profonde sensation de détente. Beaucoup de pratiquants décrivent leurs premières
          immersions comme une expérience unique de calme et de connexion avec l’eau.
        </p>
        <p>
          Que vous soyez simplement curieux ou que vous souhaitiez développer une nouvelle
          compétence, prendre un premier cours d’apnée est souvent le début d’une aventure
          passionnante. Avec l’accompagnement d’un instructeur qualifié, vous apprendrez à respirer
          efficacement, à vous relaxer et à découvrir en toute sécurité vos premières sensations
          sous l’eau.
        </p>
      </section>

    </>
  )
}


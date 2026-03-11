import { Header } from '../components/Header.jsx'
import { Footer } from '../components/Footer.jsx'

export function MainLayout({ children, title }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '2rem',
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header title={title} />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
      <Footer />
    </div>
  )
}


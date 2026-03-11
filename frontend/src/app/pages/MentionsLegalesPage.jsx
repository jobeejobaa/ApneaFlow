export function MentionsLegalesPage() {
  return (
    <section className="card" style={{ textAlign: 'left' }}>
      <h1 style={{ marginTop: 0 }}>Mentions légales</h1>

      <h2>Éditeur du site</h2>
      <p>Ce site est édité par :</p>
      <ul>
        <li>
          <strong>Nom :</strong> Johanna
        </li>
        <li>
          <strong>Statut :</strong> Projet pédagogique
        </li>
        <li>
          <strong>Responsable de la publication :</strong> johanna
        </li>
        <li>
          <strong>Email :</strong>{' '}
          <a href="mailto:johannadelfieux@gmail.co">johannadelfieux@gmail.co</a>
        </li>
      </ul>
      <p>
        Ce site a été réalisé dans le cadre d’un projet d’apprentissage du développement
        web.
      </p>

      <h2>Hébergement</h2>
      <p>Le site est hébergé par :</p>
      <p style={{ marginBottom: 8 }}>
        <strong>Render, Inc.</strong>
        <br />
        525 Brannan Street
        <br />
        San Francisco, CA 94107
        <br />
        États-Unis
        <br />
        <a href="https://render.com" target="_blank" rel="noreferrer">
          https://render.com
        </a>
      </p>
      <p style={{ marginTop: 0 }}>
        Si tu utilises Railway :
        <br />
        <strong>Railway Corp.</strong>
        <br />
        <a href="https://railway.app" target="_blank" rel="noreferrer">
          https://railway.app
        </a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les contenus présents sur ce site (textes, images, design, structure du site)
        sont protégés par le droit de la propriété intellectuelle.
      </p>
      <p>Toute reproduction, modification ou diffusion sans autorisation est interdite.</p>

      <h2>Limitation de responsabilité</h2>
      <p>Les informations présentes sur ce site sont fournies à titre indicatif.</p>
      <p>
        L’éditeur du site ne peut être tenu responsable des erreurs, omissions ou d’une
        mauvaise utilisation du service.
      </p>
    </section>
  )
}


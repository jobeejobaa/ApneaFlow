export function PolitiqueConfidentialitePage() {
  return (
    <section className="card" style={{ textAlign: 'left' }}>
      <h1 style={{ marginTop: 0 }}>Politique de confidentialité</h1>

      <h2>Introduction</h2>
      <p>
        La présente politique de confidentialité explique comment les données
        personnelles des utilisateurs sont collectées et utilisées lors de
        l’utilisation de la plateforme.
      </p>

      <h2>Données collectées</h2>
      <p>Lors de l’utilisation du site, certaines données peuvent être collectées :</p>
      <ul>
        <li>nom et prénom</li>
        <li>adresse email</li>
        <li>mot de passe</li>
        <li>informations liées aux réservations</li>
        <li>données techniques de navigation</li>
      </ul>

      <h2>Sécurité des mots de passe</h2>
      <p>Les mots de passe ne sont jamais stockés en clair.</p>
      <p>
        Ils sont protégés par un système de hachage sécurisé utilisant l’algorithme
        bcrypt.
      </p>
      <p>
        <strong>Référence technique :</strong> bcrypt
      </p>

      <h2>Finalité de la collecte</h2>
      <p>Les données sont collectées pour :</p>
      <ul>
        <li>créer et gérer un compte utilisateur</li>
        <li>permettre la réservation de cours</li>
        <li>améliorer le fonctionnement du site</li>
        <li>assurer la sécurité de la plateforme</li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>Les données sont conservées pendant la durée d’utilisation du compte utilisateur.</p>
      <p>L’utilisateur peut demander la suppression de son compte à tout moment.</p>

      <h2>Droits des utilisateurs</h2>
      <p>
        Conformément au <strong>Règlement général sur la protection des données</strong>,
        les utilisateurs disposent des droits suivants :
      </p>
      <ul>
        <li>droit d’accès aux données</li>
        <li>droit de rectification</li>
        <li>droit de suppression</li>
        <li>droit à la limitation du traitement</li>
      </ul>
      <p>
        <strong>Pour exercer ces droits :</strong> Contact :{' '}
        <a href="mailto:johannadelfieux@gmail.co">johannadelfieux@gmail.co</a>
      </p>
    </section>
  )
}


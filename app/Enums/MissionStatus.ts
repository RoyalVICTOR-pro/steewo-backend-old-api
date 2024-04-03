enum MissionStatus {
  // Si la mission est créée par un client, elle est d'abord en cours de création
  CREATION_IN_PROGRESS_BY_CLIENT = 1,
  // Dès que le client demande à ce qu'elle soit validée, on passe en statut en attente de validation par l'administrateur
  WAITING_FOR_VALIDATION_BY_ADMIN = 2,
  // Dès que l'administrateur valide, la mission est publiée et en attente de postulant
  PUBLISHED_AND_WAITING_FOR_APPLICANT = 3,
  // Dès qu'un premier étudiant postule, on considère que le client est en train de comparer les postulants
  COMPARING_APPLICANT = 4,
  // Dès qu'il a choisi son postulant final, on demande à l'étudiant de valider son engagement
  STUDENT_SELECTED_AND_WAITING_FOR_VALIDATION_BY_STUDENT = 5,
  // Dès que l'étudiant a validé, on demande au client de payer
  STUDENT_SELECTED_AND_WAITING_FOR_PAYMENT = 6,
  // Dès que le paiement a été validé, la mission est lancée, elle est en cours
  MISSION_IN_PROGRESS = 7,
  // La mission peut être terminée par l’étudiant
  MISSION_CLOSED_BY_STUDENT = 8,
  // La mission peut être déclarée comme étant en litige
  MISSION_IN_DISPUTE = 9,
  // La mission doit être terminée par le client
  MISSION_CLOSED_AND_WAITING_FOR_INVOICE = 10,
  // A la fin de la mission l'étudiant doit envoyer sa facture pour être payé.
  // La facture doit être validée par l'admin Steewo. Si c'est validé, on déclenche le paiement à l'étudiant
  STUDENT_INVOICE_RECEIVED = 11,
  // Si l'admin valide la facture de l'étudiant
  STUDENT_INVOICE_ACCEPTED = 12,
  // Ce statut est appliqué si le paiement est réussi
  STUDENT_PAID = 13,
}

export default MissionStatus

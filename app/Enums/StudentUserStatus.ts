// Starts at two because One is the user status for email registration
enum StudentUserStatus {
  ACCOUNT_CREATED = 2,
  ACCOUNT_VALIDATION_ASKED = 3,
  ACCOUNT_VALIDATED = 4,
  READY_TO_GET_PAID = 5,
}

export default StudentUserStatus

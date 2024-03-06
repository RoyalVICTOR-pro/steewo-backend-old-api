// Starts at two because One is the user status for email registration
enum StudentUserStatus {
  ACCOUNT_CREATED = 2,
  PROFILE_COMPLETED = 3,
  ACCOUNT_VALIDATION_ASKED = 4,
  ACCOUNT_VALIDATED = 5,
  READY_TO_GET_PAID = 6,
}

export default StudentUserStatus

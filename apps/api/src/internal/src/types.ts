export interface UserAuthRequest {
    token: string;
    fields: (
      | "firstName"
      | "lastName"
      | "email"
      | "pictures"
      | "userDeleted"
      | "role"
      | "friends"
      | "pulseId"
      | "dob"
    )[];
  }
  
export interface UserAuthResponse {
    data: Partial<Record<UserAuthRequest["fields"][number], any>>;
}  
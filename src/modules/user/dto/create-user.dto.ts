export default class CreateUserDto {
  public name!: string;
  public email!: string ;
  public profilePictureUri?: string;
  public password!: string;
}

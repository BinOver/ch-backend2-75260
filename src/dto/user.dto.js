export default class UserDTO {
  constructor(user) {
    this.firts_name = user.firts_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
    this.cart = user.cart;
  }
}

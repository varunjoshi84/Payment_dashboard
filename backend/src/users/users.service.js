const { Injectable } = require('@nestjs/common');
const bcrypt = require('bcrypt');

@Injectable()
class UsersService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  static get parameters() {
    return ['UserModel'];
  }

  async create(createUserDto) {
    const { password, ...userData } = createUserDto;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const createdUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    
    const savedUser = await createdUser.save();
    const { password: _, ...result } = savedUser.toObject();
    return result;
  }

  async findAll() {
    return this.userModel.find({}, '-password').exec();
  }

  async findById(id) {
    return this.userModel.findById(id, '-password').exec();
  }

  async findByUsername(username) {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email) {
    return this.userModel.findOne({ email }, '-password').exec();
  }

  async update(id, updateUserDto) {
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { 
      new: true 
    }).select('-password').exec();
  }

  async remove(id) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async createDefaultAdmin() {
    const existingAdmin = await this.findByUsername('admin');
    if (!existingAdmin) {
      return this.create({
        username: 'admin',
        email: 'admin@paymentdashboard.com',
        password: 'admin123',
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
      });
    }
    return existingAdmin;
  }
}

module.exports = { UsersService };

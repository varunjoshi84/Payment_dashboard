const { Module } = require('@nestjs/common');
const { MongooseModule, getModelToken } = require('@nestjs/mongoose');
const { UsersService } = require('./users.service');
const { UsersController } = require('./users.controller');
const { UserSchema } = require('./user.schema');

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useFactory: (userModel) => new UsersService(userModel),
      inject: [getModelToken('User')],
    },
  ],
  exports: [UsersService],
})
class UsersModule {}

module.exports = { UsersModule };

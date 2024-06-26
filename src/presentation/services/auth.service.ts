import { JwtAdapter, bcryptAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";


export class AuthService {

  constructor() {}

  public async registerUser( registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email })
    if ( existUser ) throw CustomError.badRequest('Email already exist.')

    try {
      const user = new UserModel( registerUserDto )

      // Encriptar el password
      user.password = bcryptAdapter.hash(registerUserDto.password)

      await user.save();
      // JWT para mantener la authenticacon del usuario

      // Email de confimacion

      const { password, ...userEntity } = UserEntity.fromObject(user)

      const token = await JwtAdapter.generateToken({ id: user.id })
      if ( !token ) throw CustomError.internalServer('Error while creating JWT')

      return {
        user: userEntity,
        token: token
      };
    } catch (err) {
      throw CustomError.internalServer(`${ err }`)
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email })
    if ( !user ) throw CustomError.badRequest('Email not exist.')

    const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password)
    if (!isMatch) throw CustomError.badRequest('Password is not valid')

    const { password, ...userEntity } = UserEntity.fromObject(user)

    const token = await JwtAdapter.generateToken({ id: user.id })
    if ( !token ) throw CustomError.internalServer('Error while creating JWT')

    return {
      user: userEntity,
      token: token
    }
  }
}

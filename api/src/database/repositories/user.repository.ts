import { injectable } from 'inversify';
import { Types } from 'mongoose';
import {
  IGoogleSignUpModel,
  SignUpModel
} from '../../domain/interfaces/account';
import User, { IUserDocument } from '../models/user.model';

export interface IUserRepository {
  createOne(model: SignUpModel | IGoogleSignUpModel): Promise<IUserDocument>;
  findOneByGoogleId(
    googleId: string,
    safeguard?: boolean
  ): Promise<IUserDocument | null>;
  findOneByRefreshToken(
    refreshToken: string,
    safeguard?: boolean
  ): Promise<IUserDocument | null>;
  findOneByIdAndUpdate(
    _id: Types.ObjectId,
    update: any
  ): Promise<IUserDocument | null>;
}

@injectable()
export class UserRepositoryImpl implements IUserRepository {
  async createOne(
    model: SignUpModel | IGoogleSignUpModel
  ): Promise<IUserDocument> {
    const user = new User(model);
    return await user.save();
  }

  async findOneByGoogleId(
    googleId: string,
    safeguard = true
  ): Promise<IUserDocument | null> {
    // check if password should be returned with user document
    return safeguard
      ? await User.findOne({ googleId }).select('-password -__v')
      : await User.findOne({ googleId });
  }

  async findOneByRefreshToken(
    refreshToken: string,
    safeguard = true
  ): Promise<IUserDocument | null> {
    // check if password should be returned with user document
    return safeguard
      ? await User.findOne({ refreshToken }).select('-password -__v')
      : await User.findOne({ refreshToken });
  }

  async findOneByIdAndUpdate(
    _id: Types.ObjectId,
    update: any
  ): Promise<IUserDocument | null> {
    return await User.findByIdAndUpdate(_id, update);
  }
}

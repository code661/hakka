import {
  Field,
  Int,
  ObjectType,
  registerEnumType,
  ArgsType,
} from 'type-graphql'

@ObjectType()
export class UserPublicInfo {
  @Field((type) => Int)
  id: number

  @Field()
  username: string

  @Field({ nullable: true })
  avatar?: string
}

export enum SORT_ORDER {
  desc = 'desc',
  asc = 'asc',
}

registerEnumType(SORT_ORDER, {
  name: 'SORT_ORDER',
})

@ArgsType()
export class SignupArgs {
  @Field()
  email: string

  @Field()
  password: string
}

@ArgsType()
export class LoginArgs {
  @Field()
  email: string

  @Field()
  password: string
}

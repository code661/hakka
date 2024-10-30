import { Args, Mutation, Resolver } from 'type-graphql'
import { hash, verify } from '@node-rs/argon2'
import { prisma } from '@server/lib/prisma'
import { LoginArgs, SignupArgs } from './resolver.types'
import { ApolloError } from 'apollo-server-micro'
import { nanoid } from 'nanoid'
import { createSecureToken } from '../lib/auth'
import { serialize } from 'cookie'
import { AUTH_COOKIE_NAME } from '../lib/constants'
import { Context, GqlContext } from '@server/decorators/gql-context'
@Resolver()
export class AuthResolver {
  @Mutation((returns) => Boolean)
  async signup(@GqlContext() ctx: Context, @Args() args: SignupArgs) {
    const password = await hash(args.password)
    const existing = await prisma.user.findUnique({
      where: {
        email: args.email,
      },
    })
    if (existing) {
      throw new ApolloError('Email already in use')
    }
    const providerKey = `localUserId`
    const user = await prisma.user.create({
      data: {
        email: args.email,
        password: password,
        username: `user_${nanoid(5)}`,
        [providerKey]: nanoid(16),
      },
    })
    const authToken = await createSecureToken({
      userId: user.id,
    })
    const maxAge = 60 * 60 * 24 * 90 // 3 month
    const authCookie = serialize(AUTH_COOKIE_NAME, authToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge,
      domain: process.env.NODE_ENV === 'production' ? '.hakka.dev' : undefined,
    })
    ctx.res.setHeader('Set-Cookie', [authCookie])
    return true
  }

  @Mutation((returns) => Boolean)
  async login(@GqlContext() ctx: Context, @Args() args: LoginArgs) {
    const user = await prisma.user.findUnique({
      where: {
        email: args.email,
      },
    })

    if (!user) {
      throw new ApolloError('Account not found')
    }
    if (!user.password) {
      throw new ApolloError('Password not set')
    }

    const valid = await verify(user.password, args.password)

    if (!valid) {
      throw new ApolloError('Invalid password')
    }

    const authToken = await createSecureToken({
      userId: user.id,
    })
    const maxAge = 60 * 60 * 24 * 90 // 3 month
    const authCookie = serialize(AUTH_COOKIE_NAME, authToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge,
      domain: process.env.NODE_ENV === 'production' ? '.hakka.dev' : undefined,
    })
    ctx.res.setHeader('Set-Cookie', [authCookie])
    return true
  }
}

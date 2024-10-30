import React from 'react'
import { AuthUser, getServerSession } from '@server/lib/auth'
import { GetServerSideProps } from 'next'
import { AuthProvider } from '@src/hooks/useAuth'
import Head from 'next/head'
import { Main } from '@src/components/Main'
import { useFormik } from 'formik'
import { useSignupMutation, useLoginMutation } from '@src/generated/graphql'
import Link from 'next/link'
import router from 'next/router'

type PageProps = {
  user: AuthUser | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)

  if (user) {
    return {
      redirect: {
        destination: '/',
        statusCode: 302,
      },
    }
  }

  return {
    props: {
      user,
    },
  }
}

const handleError = (error: Error) => {
  alert(error.message)
}
const LoginPage: React.FC<PageProps> = ({ user }) => {
  const [, signupMutation] = useSignupMutation()

  const form = useFormik({
    initialValues: {
      password: '',
      email: '',
    },
    async onSubmit(values) {
      const { error } = await signupMutation({
        email: values.email,
        password: values.password,
      })
      if (error) {
        handleError(error)
        return
      }
      router.push('/')
    },
  })
  return (
    <AuthProvider value={user}>
      <Head>
        <title>登录 - HAKKA!</title>
      </Head>
      <Main
        render={() => (
          <div className="text-center p-8">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                  Sign up
                </h2>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={form.handleSubmit}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-white text-left"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={form.values.email}
                        onChange={form.handleChange}
                        className="px-3 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Password
                      </label>
                      <div className="text-sm">
                        <a
                          href="#"
                          className="font-semibold text-orange-400 hover:text-orange-300"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={form.values.password}
                        onChange={form.handleChange}
                        className="px-3 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="button flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
                <div className="text-center">
                  <p className="mt-2 text-sm text-gray-300 dark:text-neutral-400">
                    Already have an account?
                    <Link href="/login">
                      <a className="text-orange-400 hover:text-orange-300">
                        Sign in here
                      </a>
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200/20" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-body-bg px-6 text-white">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="p-5">
              <a className="button" href={`/api/connect/github`}>
                <svg
                  id="i-github"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  className="w-5 h-5"
                >
                  <path
                    strokeWidth="0"
                    fill="currentColor"
                    d="M32 0 C14 0 0 14 0 32 0 53 19 62 22 62 24 62 24 61 24 60 L24 55 C17 57 14 53 13 50 13 50 13 49 11 47 10 46 6 44 10 44 13 44 15 48 15 48 18 52 22 51 24 50 24 48 26 46 26 46 18 45 12 42 12 31 12 27 13 24 15 22 15 22 13 18 15 13 15 13 20 13 24 17 27 15 37 15 40 17 44 13 49 13 49 13 51 20 49 22 49 22 51 24 52 27 52 31 52 42 45 45 38 46 39 47 40 49 40 52 L40 60 C40 61 40 62 42 62 45 62 64 53 64 32 64 14 50 0 32 0 Z"
                  />
                </svg>
                <span className="ml-2">使用 GitHub 账号登录</span>
              </a>
            </div>
          </div>
        )}
      />
    </AuthProvider>
  )
}

export default LoginPage

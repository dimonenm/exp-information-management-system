import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'mainApp',
}
export default function Home() {
  return (
    <main className='flex min-h-screen flex-col  bg-gray-100'>main app</main>
  )
}

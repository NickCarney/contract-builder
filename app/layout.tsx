import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Image from 'next/image'
import mesaImage from './public/images/mesa_logo.png'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Mesa contract builder',
  description: 'create music splits contracts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="h-1/5 text-2xl">
          <Image
            className="float-left"
            src={mesaImage}
            width={50}
            height={50}
            alt="M"
          ></Image>
          <p className="float-left">
            <b> mesa</b>
          </p>
          <div className="float-right text-xs">
            <p className="text-2xl font-black">MUSIC SPLITS</p>
            Contract Builder
          </div>
          <hr className="w-screen" />
        </header>
        {children}
      </body>
    </html>
  )
}

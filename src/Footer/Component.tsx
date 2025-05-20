import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'
import type { Media } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import FooterComponent from './FooterComponent/FooterComponent'

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as Footer

  const navItems = footerData?.navItems || []
  const copyright = footerData?.copyright

  return (
    <>
      <FooterComponent />

      <footer className="mt-auto border-t border-border bg-black text-white">
        <div className="container px-4 py-10 flex flex-col md:flex-row md:justify-between md:items-start gap-10">
          {/* Left: Logo */}
          <div className="space-y-4">
            <Link href="/home" className="inline-block">
              <img src="/logo-white.svg" alt="logo" className="h-10 w-auto" />
            </Link>
          </div>
    
          {/* Right: Navigation */}
          <div className="w-full md:w-auto">
            <h3 className="text-md font-semibold mb-4 text-gray-300">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              {navItems.map(({ link }, i) => {
                const icon = link?.icon as Media | undefined

                return (
                  <div key={i} className="flex items-center gap-2">
                    {icon?.url && (
                      <img
                        src={icon.url}
                        alt={icon.alt || 'icon'}
                        className="w-5 h-5"
                      />
                    )}
                    <CMSLink
                      {...link}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                      newTab={true}
                    />
                  </div>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border text-center text-sm text-gray-500 py-6 px-4">
          {copyright}
        </div>
      </footer>
    </>
  )
}

export default Footer

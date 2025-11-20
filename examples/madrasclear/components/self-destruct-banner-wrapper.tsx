'use client'

import { useState, useEffect } from 'react'
import { SelfDestructBanner } from './self-destruct-banner'

export function SelfDestructBannerWrapper() {
  const [isTempPlayground, setIsTempPlayground] = useState(false)

  useEffect(() => {
    const hostname = window.location.hostname
    const searchParams = new URLSearchParams(window.location.search)

    const isTemp =
      // 1. Check for explicit query param (useful for testing)
      searchParams.get('demo') === 'true' ||
      // 2. Check for environment variable (set by backend generation)
      process.env.NEXT_PUBLIC_IS_TEMP_DEMO === 'true' ||
      // 3. Check for specific URL pattern used by backend deployments
      // We only check for 'madrasly-' to be specific, avoiding generic 'vercel.app' matches
      hostname.includes('madrasly-')

    setIsTempPlayground(isTemp)
  }, [])

  if (!isTempPlayground) {
    return null
  }

  return <SelfDestructBanner destructTime={15} />
}


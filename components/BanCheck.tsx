'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { checkUserBan } from '@/lib/api/anti-abuse/profile'

/**
 * Component to check if user is banned and redirect to /banned page
 * Include this in protected pages
 */
export default function BanCheck() {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Don't check if already on banned page
        if (pathname === '/banned') {
            return
        }

        const checkBan = async () => {
            try {
                const user = await getCurrentUser()
                if (!user) {
                    // Not logged in - no ban check needed
                    return
                }

                const ban = await checkUserBan(user.id)
                if (ban.isBanned) {
                    console.log('[BanCheck] User is banned, redirecting to /banned')
                    router.push('/banned')
                }
            } catch (error) {
                console.error('[BanCheck] Error checking ban status:', error)
                // Don't redirect on error - let user continue
            }
        }

        checkBan()
    }, [router, pathname])

    // This component doesn't render anything
    return null
}

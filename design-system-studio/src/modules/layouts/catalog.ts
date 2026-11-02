import type { DesktopLayout, MobileLayout } from './types'
import { desktopLayouts as desktopData } from './catalog.desktop'
import { mobileLayouts as mobileData } from './catalog.mobile'

/** 42 arquiteturas desktop (dados puros, sem JSX). */
export const desktopLayouts: DesktopLayout[] = desktopData

/** 44 arquiteturas mobile (dados puros, sem JSX). */
export const mobileLayouts: MobileLayout[] = mobileData

const desktopIndex = new Map(desktopLayouts.map((l) => [l.id, l]))
const mobileIndex = new Map(mobileLayouts.map((l) => [l.id, l]))

export const desktopById = (id: string | null | undefined) => (id ? desktopIndex.get(id) : undefined)
export const mobileById = (id: string | null | undefined) => (id ? mobileIndex.get(id) : undefined)

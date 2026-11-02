import { ModuleStub } from '@/shell/ModuleStub'

/** Galeria de 42 arquiteturas desktop com miniaturas didáticas. */
export function DesktopGallery(_props: { guided?: boolean }) {
  return <ModuleStub name="Layout desktop" />
}
/** 44 arquiteturas mobile: miniaturas + celular grande interativo. */
export function MobileStudio(_props: { guided?: boolean }) {
  return <ModuleStub name="Layout mobile" />
}

/**
 * The Studio renders its own full-page shell, so it deliberately bypasses the
 * site's header, footer and global styles.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children
}

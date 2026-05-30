import { cn } from '../../../utils/cn.js'
import { skeletonVariants } from './Skeleton.styles.jsx'

/**
 * Skeleton - Placeholder animado com shimmer
 *
 * Imita o layout do conteúdo enquanto carrega (sem layout shift).
 * Decorativo — não é anunciado por screen readers.
 *
 * @example
 * ```jsx
 * <Skeleton variant="text" />
 * <Skeleton variant="title" width="40%" />
 * <Skeleton variant="avatar" size={48} />
 * <Skeleton variant="card" height={200} />
 * ```
 */
export const Skeleton = ({
  variant = 'text',
  width,
  height,
  size = 40,
  className,
  style,
  ...rest
}) => {
  const dimensionStyle = {
    ...(width != null && {
      width: typeof width === 'number' ? `${width}px` : width,
    }),
    ...(height != null && {
      height: typeof height === 'number' ? `${height}px` : height,
    }),
    ...(variant === 'avatar' && {
      width: size,
      height: size,
    }),
  }

  return (
    <div
      aria-hidden="true"
      className={cn(skeletonVariants({ variant }), className)}
      style={{ ...dimensionStyle, ...style }}
      {...rest}
    />
  )
}

Skeleton.displayName = 'Skeleton'

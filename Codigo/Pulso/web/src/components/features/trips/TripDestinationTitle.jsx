import { cn } from '@/design-system/utils/cn.js'
import {
  formatTripDestinationDisplay,
  getTripDestinationParts,
} from '@/utils/tripDestinationDisplay.js'

export function TripDestinationTitle({
  destino,
  destinoMeta,
  as: Component = 'span',
  className,
  stacked = false,
}) {
  const { city, country } = getTripDestinationParts(destino, destinoMeta)
  const display = formatTripDestinationDisplay(destino, destinoMeta)

  if (stacked && city && country) {
    return (
      <Component className={cn('trip-destination trip-destination--stacked', className)}>
        <span className="trip-destination__city">{city}</span>
        <span className="trip-destination__detail">{country}</span>
      </Component>
    )
  }

  return <Component className={className}>{display}</Component>
}

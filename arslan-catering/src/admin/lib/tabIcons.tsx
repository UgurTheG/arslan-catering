import {
  Camera,
  FileText,
  Heart,
  House,
  MapPin,
  Phone,
  PlayCircle,
  Settings,
  Shield,
} from 'lucide-react'

export function getTabIcon(key: string, size = 18): React.ReactNode {
  switch (key) {
    case 'startseite':
      return <House size={size} />
    case 'about':
      return <Heart size={size} />
    case 'galerie':
      return <Camera size={size} />
    case 'venues':
      return <MapPin size={size} />
    case 'videos':
      return <PlayCircle size={size} />
    case 'kontakt':
      return <Phone size={size} />
    case 'impressum':
      return <FileText size={size} />
    case 'datenschutz':
      return <Shield size={size} />
    case 'config':
      return <Settings size={size} />
    default:
      return null
  }
}

// Centralized icon management for better tree-shaking and consistency
// Following lucide.dev best practices - using only verified icons

// Dashboard Icons
export {
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Sparkles,
  AlertTriangle,
  Users,
  MessageSquare,
  Star,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  Settings,
  Plus,
  Minus,
  Eye,
  Search,
  Filter,
  Bell,
  Globe,
  Server,
  Cpu,
  Shield,
  Zap,
  FileText,
  Share2,
  Info,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Lightbulb
} from 'lucide-react'

// Navigation Icons  
export {
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home,
  Menu,
  X
} from 'lucide-react'

// Business Icons
export {
  DollarSign,
  ShoppingCart,
  Package,
  Briefcase,
  Building,
  CreditCard,
  Wallet
} from 'lucide-react'

// Communication Icons
export {
  Mail,
  Phone,
  Video,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Headphones,
  MessageCircle,
  Send
} from 'lucide-react'

// Media Icons
export {
  Play,
  Pause,
  Square as Stop,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Upload,
  Download as DownloadIcon,
  Image,
  Camera,
  Film
} from 'lucide-react'

// File Icons
export {
  File,
  FileImage,
  FileText as FileTextIcon,
  FileAudio,
  FileVideo,
  Folder,
  FolderOpen,
  Archive
} from 'lucide-react'

// UI Icons
export {
  Maximize2,
  Minimize2,
  Edit,
  Trash2,
  Copy,
  Save,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from 'lucide-react'

// Status Icons
export {
  Check,
  AlertOctagon,
  HelpCircle,
  Loader,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Power,
  PowerOff
} from 'lucide-react'

// Social Icons
export {
  Github,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink,
  Link,
  Bookmark,
  Heart,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

// Theme and Customization
export {
  Sun,
  Moon,
  Palette,
  Paintbrush,
  Layers,
  Layout,
  Grid,
  List,
  Sliders
} from 'lucide-react'

// Advanced Icons
export {
  Bot,
  Code,
  Terminal,
  Database,
  Key,
  Lock,
  Unlock,
  Fingerprint,
  QrCode,
  Scan,
  Webhook,
  Radio,
  Rss,
  Bluetooth
} from 'lucide-react'

// Icon size and styling utilities
export const ICON_SIZES = {
  xs: 12,
  sm: 16, 
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48
} as const

export type IconSize = keyof typeof ICON_SIZES

// Default icon props following lucide.dev recommendations
export const DEFAULT_ICON_PROPS = {
  size: ICON_SIZES.md,
  strokeWidth: 2,
  className: ''
} as const

// Utility function to get icon props with consistent sizing
export function getIconProps(size: IconSize = 'md', className?: string) {
  return {
    size: ICON_SIZES[size],
    strokeWidth: size === 'xs' || size === 'sm' ? 1.5 : 2,
    className: className || ''
  }
}
import {
    AlarmClock,
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    BarChart3,
    CalendarDays,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronsUpDown,
    ChevronUp,
    Circle,
    Copy,
    CreditCard,
    Crop,
    DollarSign,
    Download,
    Edit,
    Eye,
    EyeOff,
    FileTerminal,
    Filter,
    Footprints,
    HardHat,
    Image,
    Loader2,
    LogOut,
    Menu,
    MessageSquare,
    Minus,
    Moon,
    MoreHorizontal,
    MoreVertical,
    Package,
    Plus,
    PlusCircle,
    RefreshCw,
    Search,
    Send,
    Settings,
    Shirt,
    ShoppingBag,
    ShoppingCart,
    Sliders,
    SlidersHorizontal,
    Star,
    SunMedium,
    Trash,
    UploadCloud,
    User,
    Volume2,
    VolumeX,
    Wallet,
    X,
    Users2,
    BookOpen,
    MapPin,
} from "lucide-react"


//types
import type { LucideIcon, LucideProps } from "lucide-react"

export type Icon = LucideIcon | ((props: LucideProps) => JSX.Element)
export type AppIcon = Icon 
export type AppIconProps = Parameters<AppIcon>[0]
export type AppIconReturn = ReturnType<AppIcon>

export const SharedIcons = {
    sun: SunMedium,
    moon: Moon,
    star: Star,
    close: X,
    spinner: Loader2,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    chevronsLeft: ChevronsLeft,
    chevronsRight: ChevronsRight,
    chevronUp: ChevronUp,
    chevronDown: ChevronDown,
    chevronUpDown: ChevronsUpDown,
    arrowUp: ArrowUp,
    arrowDown: ArrowDown,
    menu: Menu,
    verticalThreeDots: MoreVertical,
    horizontalThreeDots: MoreHorizontal,
    verticalSliders: Sliders,
    horizontalSliders: SlidersHorizontal,
    circle: Circle,
    check: Check,
    add: Plus,
    addCircle: PlusCircle,
    remove: Minus,
    view: Eye,
    hide: EyeOff,
    trash: Trash,
    edit: Edit,
    crop: Crop,
    reset: RefreshCw,
    send: Send,
    copy: Copy,
    downlaod: Download,
    warning: AlertTriangle,
    search: Search,
    filter: Filter,
    alarm: AlarmClock,
    calendar: CalendarDays,
    user: User,
    terminal: FileTerminal,
    settings: Settings,
    logout: LogOut,
    volumne: Volume2,
    volumneMute: VolumeX,
    message: MessageSquare,
    billing: CreditCard,
    wallet: Wallet,
    dollarSign: DollarSign,
    cart: ShoppingCart,
    product: Package,
    store: ShoppingBag,
    chart: BarChart3,
    upload: UploadCloud,
    placeholder: Image,
    clothing: Shirt,
    shoes: Footprints,
    accessories: HardHat,
    users: Users2,
    book: BookOpen,
    mapPin: MapPin,

} satisfies Record<string, AppIcon>

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground">&copy; {new Date().getFullYear()} TillyHacks. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
            Terms of Service
          </Link>
          <Link href="mailto:hello@tillyhacks.org" className="text-sm text-muted-foreground hover:text-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  )
}

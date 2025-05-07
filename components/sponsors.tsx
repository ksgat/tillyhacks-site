import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Sponsors() {
  return (
    <div className="space-y-6">
      <p className="text-center">
        Shoutout to our amazing sponsors! Interested in sponsoring? Check our{" "}
        <Link href="/prospectus.pdf" className="text-primary hover:underline">
          prospectus
        </Link>
        .
      </p>

      <div className="flex flex-wrap justify-center items-center gap-8">
        <Image
          src="/placeholder.svg?height=50&width=150"
          alt="Sponsor 1"
          width={150}
          height={50}
          className="opacity-70 hover:opacity-100 transition-opacity"
        />
        <Image
          src="/placeholder.svg?height=50&width=150"
          alt="Sponsor 2"
          width={150}
          height={50}
          className="opacity-70 hover:opacity-100 transition-opacity"
        />
        <Image
          src="/placeholder.svg?height=50&width=150"
          alt="Sponsor 3"
          width={150}
          height={50}
          className="opacity-70 hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="text-center mt-8">
        <p className="mb-4">Want to contribute?</p>
        <Link href="https://hcb.hackclub.com/donations/start/tillyhacks">
          <Button>Donate Now</Button>
        </Link>
      </div>
    </div>
  )
}

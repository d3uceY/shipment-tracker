
"use client"
import TrackingPageComponent from "./components/tracking-page"
import { useSearchParams } from "next/navigation"

export default function TrackingPage({ }) {
    const searchParams = useSearchParams()
    const shipmentId = searchParams.get("shipmentId")
    return (
        <TrackingPageComponent shipmentId={shipmentId} />
    )
}
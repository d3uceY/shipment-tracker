"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, User, MapPin, Weight, Ruler } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getShipmentById } from "@/helpers/api/delivery-api"

const getStatusProgress = (status) => {
    switch (status) {
        case "pending":
            return 20
        case "confirmed":
            return 40
        case "in-transit":
            return 60
        case "out-for-delivery":
            return 80
        case "delivered":
            return 100
        case "cancelled":
            return 0
        default:
            return 0
    }
}

const getStatusIcon = (status, isActive) => {
    const className = `w-6 h-6 ${isActive ? "text-primary" : "text-muted-foreground"}`

    switch (status) {
        case "pending":
            return <Clock className={className} />
        case "confirmed":
            return <CheckCircle className={className} />
        case "in-transit":
            return <Truck className={className} />
        case "out-for-delivery":
            return <Package className={className} />
        case "delivered":
            return <CheckCircle className={className} />
        default:
            return <Clock className={className} />
    }
}

const statusSteps = [
    { key: "pending", label: "Order Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "in-transit", label: "In Transit" },
    { key: "out-for-delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
]

const formatDriverName = (driverKey) => {
    return driverKey
        ?.split("-")
        ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        ?.join(" ")
}

export default function TrackingPage({ shipmentId }) {

    const { data: shipment, isLoading, error } = useQuery({
        queryKey: ["shipment", shipmentId],
        queryFn: () => getShipmentById(shipmentId),
        enabled: Boolean(shipmentId),
    })

    console.log("shipmentId", shipmentId)
    console.log("shipment", shipment)

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">Shipment loading...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const currentStatusIndex = statusSteps.findIndex((step) => step.key === shipment.deliveryStatus)
    const progress = getStatusProgress(shipment.deliveryStatus)

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Tracking: {shipment._id?.slice(-8)}
                    </CardTitle>
                    <CardDescription>Track your shipment in real-time</CardDescription>
                </CardHeader>
            </Card>

            {/* Status Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Delivery Status</CardTitle>
                    <CardDescription>Current progress of your shipment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Progress</span>
                            <Badge variant={progress === 100 ? "default" : "secondary"}>
                                {shipment.deliveryStatus?.replace("-", " ")}
                            </Badge>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {statusSteps.map((step, index) => {
                            const isActive = index <= currentStatusIndex
                            const isCurrent = index === currentStatusIndex

                            return (
                                <div key={step.key} className="flex flex-col items-center space-y-2">
                                    <div
                                        className={`p-3 rounded-full border-2 ${isActive ? "border-primary bg-primary/10" : "border-muted-foreground/20 bg-muted/50"
                                            }`}
                                    >
                                        {getStatusIcon(step.key, isActive)}
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                                            {step.label}
                                        </p>
                                        {isCurrent && <p className="text-xs text-primary font-medium">Current</p>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sender Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Sender Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Name</span>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">{shipment.senderName}</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Address</span>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">{shipment.senderAddress}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Recipient Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Recipient Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Name</span>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">{shipment.recipientName}</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Address</span>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">{shipment.recipientAddress}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Package Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Package Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Weight className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Weight</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{shipment.weight} kg</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Ruler className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Dimensions</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {shipment.length} × {shipment.width} × {shipment.height} cm
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Package Type</span>
                            </div>
                            <p className="text-sm text-muted-foreground capitalize">{shipment.packagingType?.replace("-", " ")}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Driver</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{formatDriverName(shipment.assignedDriver)}</p>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                        <span className="font-medium">Description</span>
                        <p className="text-sm text-muted-foreground">{shipment.packageDescription}</p>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <span className="font-medium">Delivery Time</span>
                        <Badge variant="outline">{shipment.deliveryTime?.replace("-", " ")}</Badge>
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                        <span className="font-medium">Amount</span>
                        <span className="text-lg font-bold">${shipment.amount}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

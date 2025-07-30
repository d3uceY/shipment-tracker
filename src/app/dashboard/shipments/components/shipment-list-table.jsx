"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { getDeliveries } from "@/helpers/api/delivery-api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeDeliveryStatus } from "@/helpers/api/delivery-api"
import { toast } from "sonner"



const getStatusBadgeVariant = (status) => {
    switch (status) {
        case "delivered":
            return "default"
        case "in-transit":
            return "secondary"
        case "out-for-delivery":
            return "outline"
        case "pending":
            return "destructive"
        default:
            return "secondary"
    }
}

const formatDriverName = (driverKey) => {
    return driverKey
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}


const handleDeleteShipment = (shipmentId) => {
    if (confirm("Are you sure you want to delete this shipment?")) {
        console.log(`Deleting shipment ${shipmentId}`)
        // Here you would typically make an API call to delete the shipment
    }
}

export default function ShipmentsTable() {
    const queryClient = useQueryClient()

    const handleStatusChange = (shipmentId, newStatus) => {
        toast.promise(changeDeliveryStatusMutation({ shipmentId, newStatus }), {
            loading: "Updating shipment status...",
            success: "Shipment status updated successfully!",
            error: "Failed to update shipment status."
        })
    }

    const { mutateAsync: changeDeliveryStatusMutation } = useMutation({
        mutationFn: (data) => changeDeliveryStatus(data.shipmentId, data.newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shipments"] })
        }
    })


    const { data: shipments, isLoading, error } = useQuery({
        queryKey: ["shipments"],
        queryFn: () => getDeliveries(),
    })

    const [searchTerm, setSearchTerm] = useState("")

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">Loading shipments...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">Failed to load shipments</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const filteredShipments = shipments?.data?.filter(
        (shipment) =>
            shipment.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.deliveryStatus.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Shipments Management</CardTitle>
                    <CardDescription>View and manage all shipments in your system</CardDescription>
                    <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search shipments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Shipment ID</TableHead>
                                    <TableHead>Sender</TableHead>
                                    <TableHead>Recipient</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Delivery Time</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Package Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredShipments.map((shipment) => (
                                    <TableRow key={shipment._id}>
                                        <TableCell className="font-mono text-sm">{shipment._id.slice(-8)}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{shipment.senderName}</div>
                                                <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                                                    {shipment.senderAddress}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{shipment.recipientName}</div>
                                                <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                                                    {shipment.recipientAddress}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(shipment.deliveryStatus)}>
                                                {shipment.deliveryStatus?.replace("-", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{shipment.deliveryTime?.replace("-", " ")}</TableCell>
                                        <TableCell>{formatDriverName(shipment.assignedDriver)}</TableCell>
                                        <TableCell className="capitalize">{shipment.packagingType?.replace("-", " ")}</TableCell>
                                        <TableCell>${shipment.amount}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={shipment.deliveryStatus}
                                                    onValueChange={(value) => handleStatusChange(shipment._id, value)}
                                                >
                                                    <SelectTrigger className="w-[140px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                                        <SelectItem value="in-transit">In Transit</SelectItem>
                                                        <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/tracking-page/?shipmentId=${shipment._id}`} className="flex items-center">
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Track Shipment
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {/* <DropdownMenuItem asChild>
                                                            <Link href={`/edit-shipment/${shipment._id}`} className="flex items-center">
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Shipment
                                                            </Link>
                                                        </DropdownMenuItem> */}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteShipment(shipment._id)}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Shipment
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {filteredShipments.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No shipments found matching your search criteria.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

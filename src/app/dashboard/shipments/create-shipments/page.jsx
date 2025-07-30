"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createDelivery } from "@/helpers/api/delivery-api"
import { toast } from "sonner"

const shipmentFormSchema = z.object({
    // Sender Information
    senderName: z.string().min(2, {
        message: "Sender name must be at least 2 characters.",
    }),
    senderAddress: z.string().min(10, {
        message: "Sender address must be at least 10 characters.",
    }),

    // Recipient Information
    recipientName: z.string().min(2, {
        message: "Recipient name must be at least 2 characters.",
    }),
    recipientAddress: z.string().min(10, {
        message: "Recipient address must be at least 10 characters.",
    }),

    // Shipping Details
    deliveryTime: z.string({
        required_error: "Please select a delivery time.",
    }),
    deliveryStatus: z.string({
        required_error: "Please select a delivery status.",
    }),
    packagingType: z.string({
        required_error: "Please select a packaging type.",
    }),
    assignedDriver: z.string({
        required_error: "Please assign a driver.",
    }),

    // Package Information
    amount: z.string().min(1, {
        message: "Amount is required.",
    }),
    packageDescription: z.string().min(5, {
        message: "Package description must be at least 5 characters.",
    }),
    weight: z.string().min(1, {
        message: "Weight is required.",
    }),
    length: z.string().min(1, {
        message: "Length is required.",
    }),
    width: z.string().min(1, {
        message: "Width is required.",
    }),
    height: z.string().min(1, {
        message: "Height is required.",
    }),
})

export default function ShipmentForm() {
    const form = useForm({
        resolver: zodResolver(shipmentFormSchema),
        defaultValues: {
            senderName: "",
            senderAddress: "",
            recipientName: "",
            recipientAddress: "",
            deliveryTime: "",
            deliveryStatus: "",
            packagingType: "",
            assignedDriver: "",
            amount: "",
            packageDescription: "",
            weight: "",
            length: "",
            width: "",
            height: "",
        },
    })

    function onSubmit(values) {
        console.log(values)

        const promise = async () => {
            try {
                const response = await createDelivery(values)
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }

        toast.promise(promise(), {
            loading: "Creating delivery...",
            success: "Delivery created successfully",
            error: "Failed to create delivery",
        })
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Shipment Form</h1>
                <p className="text-muted-foreground">Create a new shipment order</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Sender Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sender Information</CardTitle>
                            <CardDescription>Enter the sender/customer details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="senderName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sender Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter sender name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="senderAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sender Address</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter complete sender address" className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Recipient Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recipient Information</CardTitle>
                            <CardDescription>Enter the recipient/client details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="recipientName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recipient Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter recipient name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="recipientAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recipient Address</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter complete recipient address" className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Shipping Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Details</CardTitle>
                            <CardDescription>Configure shipping and delivery options</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="deliveryTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Delivery Time</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select delivery time" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="60-minutes">60 Minutes</SelectItem>
                                                <SelectItem value="24-hours">24 Hours</SelectItem>
                                                <SelectItem value="24-48-hours">24-48 Hours</SelectItem>
                                                <SelectItem value="3-5-days">3-5 Days</SelectItem>
                                                <SelectItem value="1-week">1 Week</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="deliveryStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Delivery Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select delivery status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="in-transit">In Transit</SelectItem>
                                                <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="packagingType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type of Packaging</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select packaging type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="small">Small (up to 1kg)</SelectItem>
                                                <SelectItem value="medium">Medium (1-5kg)</SelectItem>
                                                <SelectItem value="large">Large (5-15kg)</SelectItem>
                                                <SelectItem value="extra-large">Extra Large (15-30kg)</SelectItem>
                                                <SelectItem value="oversized">Oversized (30kg+)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="assignedDriver"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assign Driver</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select driver" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="john-doe">John Doe</SelectItem>
                                                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                                                <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                                                <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                                                <SelectItem value="david-brown">David Brown</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Package Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Package Information</CardTitle>
                            <CardDescription>Enter package details and dimensions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter amount" {...field} />
                                            </FormControl>
                                            <FormDescription>Package value or shipping cost</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Weight (kg)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Enter weight" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="packageDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Package Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe the package contents" className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="length"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Length (cm)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Length" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="width"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Width (cm)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Width" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Height (cm)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Height" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline">
                            Save as Draft
                        </Button>
                        <Button type="submit">Create Shipment</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export async function PUT(request, { params }) {
    const { status } = await request.json();
    const { id } = await params;
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);


        const delivery = await db
            .collection("deliveries")
            .updateOne({ _id: new ObjectId(id) }, { $set: { deliveryStatus: status } })

        return NextResponse.json({ success: true, data: delivery });
    } catch (error) {
        console.error("Error updating delivery status:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        const delivery = await db
            .collection("deliveries")
            .deleteOne({ _id: ObjectId(id) })

        return NextResponse.json({ success: true, data: delivery });
    } catch (error) {
        console.error("Error deleting user delivery:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

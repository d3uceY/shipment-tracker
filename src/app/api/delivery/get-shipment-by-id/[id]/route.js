import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
    const { id } = await params;
    console.log(id)
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);


        const delivery = await db
            .collection("deliveries")
            .findOne({ _id: new ObjectId(id) })

        return NextResponse.json({ success: true, data: delivery });
    } catch (error) {
        console.error("Error fetching user delivery:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
